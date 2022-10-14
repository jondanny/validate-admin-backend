data "aws_secretsmanager_secret_version" "current" {
  secret_id = var.secret_manager_id
}

locals {
  env_vars = [
    for k, v in jsondecode(data.aws_secretsmanager_secret_version.current.secret_string) : { name = k, value = v }
  ]
}

resource "aws_ecs_cluster" "admin_backend_cluster" {
  name = "admin_backend_cluster"
}

data "aws_ami" "amz_linux" {
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-2.0.*-x86_64-ebs"]
  }
}

resource "aws_cloudwatch_log_group" "admin_backend_cloudwatch_group" {
  name = "admin-backend"

  tags = {
    Environment = "production"
    Application = "Admin Backend"
  }
}

resource "aws_launch_configuration" "admin_backend_launch_config" {
  name_prefix                 = "ecs_admin_backend-"
  enable_monitoring           = true
  image_id                    = data.aws_ami.amz_linux.id
  iam_instance_profile        = var.ecs_agent_name
  security_groups             = [var.instance_security_group_id]
  associate_public_ip_address = false
  key_name                    = "validate-ec2-key"
  user_data                   = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${aws_ecs_cluster.admin_backend_cluster.name} >> /etc/ecs/ecs.config
EOF
  instance_type               = "t3.micro"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "admin_backend_ecs_asg" {
  name_prefix          = "admin_backend_asg_"
  launch_configuration = aws_launch_configuration.admin_backend_launch_config.name
  vpc_zone_identifier = [var.private_subnet_a_id, var.private_subnet_b_id]
  
  desired_capacity          = 1
  min_size                  = 1
  max_size                  = 1
  health_check_grace_period = 300
  health_check_type         = "EC2"

  lifecycle {
    create_before_destroy = true
  }

  tag {
    key                 = "Name"
    propagate_at_launch = true
    value               = "Admin Cluster Instance"
  }
}

resource "aws_ecs_task_definition" "admin_backend" {
  family                = "admin_backend_ecs_task_definition"
  container_definitions = jsonencode([
    {
      command: ["npm", "run", "start:prod"],
      environment : local.env_vars,
      memory : 384
      essential : true,
      image : "${var.admin_backend_erc_url}:latest",
      name : "admin-backend",
      portMappings : [
        {
          "containerPort" : 3000,
          "hostPort" : 3000
        }
      ],
      logConfiguration: {
        logDriver: "awslogs",
        options: {
          awslogs-group: aws_cloudwatch_log_group.admin_backend_cloudwatch_group.name,
          awslogs-region: "eu-west-1",
          awslogs-stream-prefix: "admin-backend"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "admin_backend" {
  name            = "admin-backend"
  cluster         = aws_ecs_cluster.admin_backend_cluster.id
  task_definition = aws_ecs_task_definition.admin_backend.arn
  desired_count   = 1
  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent = 100
  force_new_deployment = true
  wait_for_steady_state = true

  deployment_circuit_breaker {
    enable = true
    rollback = true
  }
}
resource "aws_secretsmanager_secret" "kafka_ui" {
  name                    = "kafka_ui/production"
  recovery_window_in_days = 0

  lifecycle {
    prevent_destroy = false
  }
}

data "aws_secretsmanager_secret_version" "current" {
  secret_id = aws_secretsmanager_secret.kafka_ui.id
}

locals {
  env_vars = [
    for k, v in jsondecode(data.aws_secretsmanager_secret_version.current.secret_string) : { name = k, value = v }
  ]
}

data "aws_ecs_cluster" "admin_backend_cluster" {
  cluster_name = "admin_backend_cluster"
}

resource "aws_cloudwatch_log_group" "kafka_ui_cloudwatch_group" {
  name = "kafka-ui"

  tags = {
    Environment = "production"
    Application = "Kafka UI"
  }
}

resource "aws_ecs_task_definition" "kafka_ui" {
  family                = "kafka_ui_ecs_task_definition"
  container_definitions = jsonencode([
    {
      environment : local.env_vars,
      memory : 384
      essential : true,
      image : "provectuslabs/kafka-ui:latest",
      name : "kafka-ui",
      portMappings : [
        {
          "containerPort" : 8080,
          "hostPort" : 8080
        }
      ],
      logConfiguration: {
        logDriver: "awslogs",
        options: {
          awslogs-group: aws_cloudwatch_log_group.kafka_ui_cloudwatch_group.name,
          awslogs-region: "eu-west-1",
          awslogs-stream-prefix: "kafka-ui"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "kafka_ui" {
  name            = "kafka-ui"
  cluster         = data.aws_ecs_cluster.admin_backend_cluster.id
  task_definition = aws_ecs_task_definition.kafka_ui.arn
  desired_count   = 1
  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent = 100
  wait_for_steady_state = true

  deployment_circuit_breaker {
    enable = true
    rollback = true
  }
}
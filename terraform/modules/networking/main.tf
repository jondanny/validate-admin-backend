data "aws_vpc" "vpc" {
  filter {
    name   = "tag:Name"
    values = ["Validate VPC"]
  }
}

data "aws_subnet" "private_subnet_a" {
  filter {
    name   = "tag:Name"
    values = ["validate-private-eu-west-1a"]
  }
}

data "aws_subnet" "private_subnet_b" {
  filter {
    name   = "tag:Name"
    values = ["validate-private-eu-west-1b"]
  }
}

data "aws_subnet" "public_subnet_a" {
  filter {
    name   = "tag:Name"
    values = ["validate-public-eu-west-1a"]
  }
}

data "aws_subnet" "public_subnet_b" {
  filter {
    name   = "tag:Name"
    values = ["validate-public-eu-west-1b"]
  }
}

data "aws_nat_gateway" "nat_gateway_a" {
  filter {
    name   = "tag:Name"
    values = ["NAT GW West 1a"]
  }
}


data "aws_nat_gateway" "nat_gateway_b" {
  filter {
    name   = "tag:Name"
    values = ["NAT GW West 1b"]
  }
}

resource "aws_security_group" "instance_sg" {
  name   = "Validate Admin Instance SG"
  vpc_id = data.aws_vpc.vpc.id

  ingress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}


output "vpc_id" {
  value = data.aws_vpc.vpc.id
}

output "instance_sg_id" {
  value = aws_security_group.instance_sg.id
}

output "public_subnet_a_id" {
  value = data.aws_subnet.public_subnet_a.id
}

output "public_subnet_b_id" {
  value = data.aws_subnet.public_subnet_b.id
}

output "private_subnet_a_id" {
  value = data.aws_subnet.private_subnet_a.id
}

output "private_subnet_b_id" {
  value = data.aws_subnet.private_subnet_b.id
}

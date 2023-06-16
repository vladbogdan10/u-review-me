provider "aws" {
  region = var.region
}

provider "awsutils" {
  region = var.region
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  version = "0.28.1"

  cidr_block = var.vpc_cidr_block
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  version = "0.39.8"

  availability_zones  = var.availability_zones
  vpc_id              = module.vpc.vpc_id
  igw_id              = module.vpc.igw_id
  cidr_block          = module.vpc.vpc_cidr_block
  nat_gateway_enabled = var.nat_gateway_enabled
}

data "aws_acm_certificate" "issued" {
  domain   = var.domain
  statuses = ["ISSUED"]
}

module "alb" {
  source  = "cloudposse/alb/aws"
  version = "0.36.0"

  access_logs_enabled       = false
  vpc_id                    = module.vpc.vpc_id
  ip_address_type           = "ipv4"
  subnet_ids                = module.subnets.public_subnet_ids
  security_group_ids        = [module.vpc.vpc_default_security_group_id]
  http_ingress_cidr_blocks  = ["0.0.0.0/0"]
  https_ingress_cidr_blocks = ["0.0.0.0/0"]
  https_enabled             = var.https_enabled
  certificate_arn           = data.aws_acm_certificate.issued.arn
  http_redirect             = var.http_redirect
  health_check_interval     = 60
}

resource "aws_ecs_cluster" "default" {
  name = module.this.id
  tags = module.this.tags
}

module "cloudwatch_logs" {
  source  = "cloudposse/cloudwatch-logs/aws"
  version = "0.6.4"

  retention_in_days = 3
}

module "container_definition" {
  source  = "cloudposse/ecs-container-definition/aws"
  version = "0.58.1"

  container_name               = var.container_name
  container_image              = "${module.ecr.repository_url}:${var.git_tag}"
  container_memory             = var.container_memory
  container_memory_reservation = var.container_memory_reservation
  container_cpu                = var.container_cpu
  essential                    = var.container_essential
  readonly_root_filesystem     = var.container_readonly_root_filesystem
  environment                  = var.container_environment
  secrets                      = var.secrets
  port_mappings                = var.container_port_mappings

  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-region"        = var.region
      "awslogs-group"         = module.cloudwatch_logs.log_group_name
      "awslogs-stream-prefix" = "app"
    }
    secretOptions = null
  }
}

module "ecs_alb_service_task" {
  source  = "cloudposse/ecs-alb-service-task/aws"
  version = "0.60.1"

  alb_security_group                 = module.vpc.vpc_default_security_group_id
  container_definition_json          = module.container_definition.json_map_encoded_list
  ecs_cluster_arn                    = aws_ecs_cluster.default.arn
  launch_type                        = var.ecs_launch_type
  vpc_id                             = module.vpc.vpc_id
  security_group_ids                 = [module.vpc.vpc_default_security_group_id]
  subnet_ids                         = module.subnets.public_subnet_ids
  ignore_changes_task_definition     = var.ignore_changes_task_definition
  network_mode                       = var.network_mode
  assign_public_ip                   = var.assign_public_ip
  propagate_tags                     = var.propagate_tags
  deployment_minimum_healthy_percent = var.deployment_minimum_healthy_percent
  deployment_maximum_percent         = var.deployment_maximum_percent
  deployment_controller_type         = var.deployment_controller_type
  desired_count                      = var.desired_count
  task_memory                        = var.task_memory
  task_cpu                           = var.task_cpu
  force_new_deployment               = var.force_new_deployment
  health_check_grace_period_seconds  = var.health_check_grace_period_seconds

  ecs_load_balancers = [{
    container_name   = var.container_name
    container_port   = var.container_port_mappings[0].containerPort
    elb_name         = ""
    target_group_arn = module.alb.default_target_group_arn
  }]
}

module "ecr" {
  source  = "cloudposse/ecr/aws"
  version = "0.32.3"

  image_tag_mutability    = "MUTABLE"
  enable_lifecycle_policy = true
}

// because no NAT
resource "aws_security_group_rule" "allow_ingress_from_alb" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  source_security_group_id = module.alb.security_group_id
  security_group_id        = module.ecs_alb_service_task.service_security_group_id
}

data "aws_route53_zone" "public" {
  name = var.domain
}

module "ses" {
  source  = "cloudposse/ses/aws"
  version = "0.22.1"

  domain        = var.domain
  zone_id       = data.aws_route53_zone.public.zone_id
  verify_dkim   = true
  verify_domain = true
}

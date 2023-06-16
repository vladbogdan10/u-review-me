region = "eu-west-1"

availability_zones = ["eu-west-1a", "eu-west-1b"]

namespace = "app"

stage = "prod"

name = "u-review-me"

domain = "u-review.me"

ignore_changes_task_definition = false

assign_public_ip = true

nat_gateway_enabled = false

container_name = "u-review-me"

force_new_deployment = true

https_enabled = true

http_redirect = true

container_environment = []

secrets = [
  {
    name      = "ACCESS_KEY_ID"
    valueFrom = "ACCESS_KEY_ID"
  },
  {
    name      = "EMAIL_SERVER_USER"
    valueFrom = "EMAIL_SERVER_USER"
  },
  {
    name      = "EMAIL_SERVER_PASSWORD"
    valueFrom = "EMAIL_SERVER_PASSWORD"
  },
  {
    name      = "GOOGLE_ID"
    valueFrom = "GOOGLE_ID"
  },
  {
    name      = "GOOGLE_SECRET"
    valueFrom = "GOOGLE_SECRET"
  },
  {
    name      = "MONGODB_URI"
    valueFrom = "MONGODB_URI"
  },
  {
    name      = "SECRET"
    valueFrom = "SECRET"
  },
  {
    name      = "SECRET_ACCESS_KEY"
    valueFrom = "SECRET_ACCESS_KEY"
  },
  {
    name      = "NEXTAUTH_URL"
    valueFrom = "NEXTAUTH_URL"
  }
]

container_port_mappings = [
  {
    containerPort = 3000
    hostPort      = 3000
    protocol      = "tcp"
  },
  #  {
  #    containerPort = 443
  #    hostPort      = 443
  #    protocol      = "udp"
  #  }
]

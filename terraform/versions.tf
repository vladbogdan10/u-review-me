terraform {
  required_version = ">= 0.13.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0"
    }
    awsutils = {
      source  = "cloudposse/awsutils"
      version = "0.11.0"
    }
  }
  backend "s3" {
    bucket  = "terraform-state-kj2h4"
    key     = "production/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

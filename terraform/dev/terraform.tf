terraform {
  backend "s3" {
    bucket = "dev-tfstate-f5ed8e4390930e22"
    key    = "tfstate"
    region = "us-east-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  required_version = ">= 1.2"
}

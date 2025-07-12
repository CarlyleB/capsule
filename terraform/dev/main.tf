provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "dev" {
  bucket = "dev-${random_id.value.hex}"

  tags = {
    Name        = "Dev bucket"
    Environment = "Dev"
  }
}

resource "random_id" "value" {
  byte_length = 8
}

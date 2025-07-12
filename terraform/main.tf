provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "example" {
  bucket = "my-tf-test-bucket-carly"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

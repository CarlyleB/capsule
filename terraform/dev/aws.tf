resource "aws_s3_bucket" "dev" {
  bucket = "dev-${random_id.s3_bucket_suffix.hex}"

  tags = {
    Name        = "Dev bucket"
    Environment = "Dev"
  }
}

resource "random_id" "s3_bucket_suffix" {
  byte_length = 8
}

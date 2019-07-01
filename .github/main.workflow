workflow "Build and push Docker container" {
  on = "push"
  resolves = ["Synchronize"]
}

action "Build" {
  uses = "smashwilson/az-infra/actions/azbuild@master"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Synchronize" {
  needs = "Build"
  uses = "smashwilson/az-infra/actions/azsync@master"
  secrets = ["AZ_COORDINATOR_TOKEN"]
}

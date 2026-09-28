# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-28

### Added
- Express server serving a static guestbook front end on port 8080
- Guestbook UI with a text input, submit button, and client-side entry list
- Dockerfile (multi-stage-free, `node:18-alpine`) with `COPY` and `EXPOSE 8080`
- Kubernetes `deployment.yml` with CPU requests/limits to support HPA
- Kubernetes `service.yml` exposing the deployment via `LoadBalancer`
- README with build, push, deploy, autoscaling, and rollout/rollback instructions

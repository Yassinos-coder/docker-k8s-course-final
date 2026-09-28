# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-09-28

### Changed

- **Breaking:** moved the app into `v1/guestbook/` to match the official lab's directory structure
- **Breaking:** app now listens on port 3000 (was 8080), matching the lab's `deployment.yml`/`kubectl port-forward` expectations
- Dockerfile rewritten as a genuine multi-stage build (`deps` stage copies `node_modules`, final stage copies runtime files only), still without running npm during the image build
- `deployment.yml` rewritten to match the lab-provided template: `RollingUpdate` strategy, `50m`/`20m` CPU limits/requests, `imagePullPolicy: Always`, and the Redis/Spring env vars from the official manifest
- `service.yml` port updated to 3000
- README updated for the new path, `kubectl port-forward` + Skills Network Toolbox workflow, and `MY_NAMESPACE` env var usage

## [1.0.2] - 2026-09-28

### Fixed

- Fixed Docker build still failing with `npm error Exit handler never called!` under `npm ci` — the lab sandbox blocks all outbound network access during `docker build`, not just the audit/funding calls. The Dockerfile now copies a host-installed `node_modules` directly instead of running any npm command during the image build.

### Changed

- `.dockerignore` no longer excludes `node_modules`, since it must now be present in the build context
- README build/push instructions updated to run `npm install` before `docker build`, and to use `docker build`/`docker push` directly instead of `ibmcloud cr build`

## [1.0.1] - 2026-09-28

### Fixed

- Fixed Docker build failing with `npm error Exit handler never called!` in restricted-network environments (e.g. IBM Skills Network lab) by switching to `npm ci --omit=dev --no-audit --no-fund`, which installs from the lockfile without the audit/funding network calls that were stalling

### Changed

- Bumped base image from `node:18-alpine` to `node:22-alpine`

## [1.0.0] - 2026-09-28

### Added

- Express server serving a static guestbook front end on port 8080
- Guestbook UI with a text input, submit button, and client-side entry list
- Dockerfile (multi-stage-free, `node:18-alpine`) with `COPY` and `EXPOSE 8080`
- Kubernetes `deployment.yml` with CPU requests/limits to support HPA
- Kubernetes `service.yml` exposing the deployment via `LoadBalancer`
- README with build, push, deploy, autoscaling, and rollout/rollback instructions

# Guestbook — Docker & Kubernetes Final Project

A simple guestbook web app built with Node.js/Express, containerized with Docker, and deployed to Kubernetes (IBM Cloud). The app is a single-page front end with a text input where visitors can enter and submit a message.

This repo is the deliverable for the IBM "Containers w/ Docker, Kubernetes & OpenShift" final project — [Lab Option B: JavaScript](https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift/ungradedLti/Ws9S9/lab-option-b-javascript-build-and-deploy-a-simple-guestbook-app).

## Project structure

```text
v1/guestbook/
├── server.js          Express server, serves the public/ folder on port 3000
├── package.json
├── Dockerfile          Multi-stage build, COPY + EXPOSE 3000
├── deployment.yml       Kubernetes Deployment (RollingUpdate, CPU requests/limits for HPA)
├── service.yml          Kubernetes Service (LoadBalancer, port 3000)
└── public/
    ├── index.html       Guestbook UI (title/h1 updated per version: v1 → "Guestbook", v2 → "Guestbook – v2")
    ├── style.css
    └── app.js
```

## Run locally

```bash
cd v1/guestbook
npm install
npm start
# open http://localhost:3000
```

## Build and push to IBM Cloud Container Registry

The Dockerfile copies a pre-installed `node_modules` into the image instead of running `npm install`/`npm ci` during the build. This is required in network-restricted sandboxes (e.g. the IBM Skills Network lab), where the Docker build step has no outbound access to the npm registry and `npm install`/`npm ci` fails with `npm error Exit handler never called!`. Always run `npm install` on the host first so `node_modules` exists before building.

```bash
cd v1/guestbook
export MY_NAMESPACE=sn-labs-$USERNAME
npm install
ibmcloud cr login
docker build -t us.icr.io/$MY_NAMESPACE/guestbook:v1 .
docker push us.icr.io/$MY_NAMESPACE/guestbook:v1
ibmcloud cr images
```

## Deploy to Kubernetes

Replace `<my-namespace>` in `deployment.yml` with your `$MY_NAMESPACE` value (check it with `ibmcloud cr namespaces`), then:

```bash
kubectl apply -f deployment.yml
```

View the app via `kubectl port-forward`, then open it through the Skills Network Toolbox (Other → Launch Application → port 3000):

```bash
kubectl port-forward deployment.apps/guestbook 3000:3000
```

To expose it via a Kubernetes Service instead (needed to generate load against a stable address for the HPA step):

```bash
kubectl apply -f service.yml
kubectl get svc guestbook
```

## Horizontal Pod Autoscaler

```bash
kubectl autoscale deployment guestbook --cpu-percent=50 --min=1 --max=5
kubectl get hpa
```

Generate load against the service to confirm the HPA scales up replicas, then re-check `kubectl get hpa`.

## Ship v2 (rolling update)

1. Update the title/h1 in `public/index.html` to `Guestbook – v2`.
2. Rebuild and push the image with the `v2` tag:

   ```bash
   docker build -t us.icr.io/$MY_NAMESPACE/guestbook:v2 .
   docker push us.icr.io/$MY_NAMESPACE/guestbook:v2
   ```

3. Update the `image:` field in `deployment.yml` to the `v2` tag.
4. Apply the update:

   ```bash
   kubectl apply -f deployment.yml
   kubectl rollout status deployment guestbook
   ```

## Rollout history and rollback

```bash
kubectl rollout history deployment guestbook
kubectl rollout undo deployment guestbook
kubectl get rs
```

## Grading checklist

| Deliverable | Where to find it |
| --- | --- |
| Dockerfile with `COPY`/`EXPOSE` | [`v1/guestbook/Dockerfile`](./v1/guestbook/Dockerfile) |
| Image pushed to IBM Cloud CR (`v1`) | `ibmcloud cr images` output |
| `index.html` default title/h1 | [`v1/guestbook/public/index.html`](./v1/guestbook/public/index.html) |
| HPA created with 0 replicas | `kubectl get hpa` output right after `kubectl autoscale` |
| HPA scaling replicas up | `kubectl get hpa` output under load |
| Docker push of updated image (`v2`) with digest | `docker push` output |
| Updated deployment applied | `kubectl apply -f deployment.yml` output |
| `index.html` title/h1 as `Guestbook – v2` | [`v1/guestbook/public/index.html`](./v1/guestbook/public/index.html) after the v2 edit |
| Rollout history with CPU-related changes | `kubectl rollout history deployment guestbook` |
| ReplicaSets after rollback | `kubectl get rs` output after `kubectl rollout undo` |

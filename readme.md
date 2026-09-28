# Guestbook — Docker & Kubernetes Final Project

A simple guestbook web app built with Node.js/Express, containerized with Docker, and deployed to Kubernetes (IBM Cloud). The app is a single-page front end with a text input where visitors can enter and submit a message.

This repo is the deliverable for the IBM "Containers w/ Docker, Kubernetes & OpenShift" final project — [Lab Option B: JavaScript](https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift/ungradedLti/Ws9S9/lab-option-b-javascript-build-and-deploy-a-simple-guestbook-app).

## Project structure

```text
.
├── server.js          Express server, serves the public/ folder on port 8080
├── package.json
├── Dockerfile          COPY + EXPOSE 8080
├── deployment.yml       Kubernetes Deployment (with CPU requests/limits for HPA)
├── service.yml          Kubernetes Service (LoadBalancer, port 8080)
└── public/
    ├── index.html       Guestbook UI (title/h1 updated per version: v1 → "Guestbook", v2 → "Guestbook – v2")
    ├── style.css
    └── app.js
```

## Run locally

```bash
npm install
npm start
# open http://localhost:8080
```

## Build and push to IBM Cloud Container Registry

```bash
ibmcloud cr login
ibmcloud cr build -t us.icr.io/<my-namespace>/guestbook:v1 .
ibmcloud cr images
```

## Deploy to Kubernetes

```bash
kubectl apply -f deployment.yml
kubectl apply -f service.yml
kubectl get pods
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
   ibmcloud cr build -t us.icr.io/<my-namespace>/guestbook:v2 .
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
| Dockerfile with `COPY`/`EXPOSE` | [`Dockerfile`](./Dockerfile) |
| Image pushed to IBM Cloud CR (`v1`) | `ibmcloud cr images` output |
| `index.html` default title/h1 | [`public/index.html`](./public/index.html) |
| HPA created with 0 replicas | `kubectl get hpa` output right after `kubectl autoscale` |
| HPA scaling replicas up | `kubectl get hpa` output under load |
| Docker push of updated image (`v2`) with digest | `ibmcloud cr build` output |
| Updated deployment applied | `kubectl apply -f deployment.yml` output |
| `index.html` title/h1 as `Guestbook – v2` | [`public/index.html`](./public/index.html) after the v2 edit |
| Rollout history with CPU-related changes | `kubectl rollout history deployment guestbook` |
| ReplicaSets after rollback | `kubectl get rs` output after `kubectl rollout undo` |

# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: eq-author-api
  labels:
    app: eq-author-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: eq-author-api
  template:
    metadata:
      labels:
        app: eq-author-api
    spec:
      containers:
      - name: eq-author-api
        image: eu.gcr.io/GOOGLE_CLOUD_PROJECT/eq-author-api:COMMIT_SHA
        ports:
        - containerPort: 4000
        env:
          - name: ALLOWED_EMAIL_LIST
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: ALLOWED_EMAIL_LIST
          - name: CORS_WHITELIST
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: CORS_WHITELIST
          - name: ENABLE_IMPORT
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: ENABLE_IMPORT
          - name: FIREBASE_PROJECT_ID
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: FIREBASE_PROJECT_ID
          - name: PUBLISHER_URL
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: PUBLISHER_URL
          - name: CONVERSION_URL
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: CONVERSION_URL
          - name: RUNNER_SESSION_URL
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: RUNNER_SESSION_URL
          - name: SURVEY_REGISTER_URL
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: SURVEY_REGISTER_URL
          - name: REDIS_DOMAIN_NAME
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: REDIS_DOMAIN_NAME
          - name: REDIS_PORT
            valueFrom:
              secretKeyRef:
                name: api-secrets
                key: REDIS_PORT
          - name: DATABASE
            value: 'firestore'
---
kind: Service
apiVersion: v1
metadata:
  name: eq-author-api
spec:
  selector:
    app: eq-author-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 4000
  type: LoadBalancer
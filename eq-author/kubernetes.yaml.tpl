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
  name: eq-author-frontend
  labels:
    app: eq-author-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: eq-author-frontend
  template:
    metadata:
      labels:
        app: eq-author-frontend
    spec:
      containers:
      - name: eq-author-frontend
        image: eu.gcr.io/GOOGLE_CLOUD_PROJECT/eq-author-frontend:COMMIT_SHA
        ports:
        - containerPort: 3000
        env:
          - name: REACT_APP_API_URL
            valueFrom:
              secretKeyRef:
                name: frontend-secrets
                key: REACT_APP_API_URL
          - name: REACT_APP_SIGN_IN_URL
            valueFrom:
              secretKeyRef:
                name: frontend-secrets
                key: REACT_APP_SIGN_IN_URL
          - name: REACT_APP_FIREBASE_PROJECT_ID
            valueFrom:
              secretKeyRef:
                name: frontend-secrets
                key: REACT_APP_FIREBASE_PROJECT_ID
          - name: REACT_APP_FIREBASE_API_KEY
            valueFrom:
              secretKeyRef:
                name: frontend-secrets
                key: REACT_APP_FIREBASE_API_KEY
---
kind: Service
apiVersion: v1
metadata:
  name: eq-author-frontend
spec:
  selector:
    app: eq-author-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
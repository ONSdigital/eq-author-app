FROM nginx:stable

EXPOSE 3000

COPY nginx /etc/nginx/
# Log to stdout/stderr
RUN mkdir -p /etc/nginx/logs && ln -sf /dev/stdout /etc/nginx/logs/access.log && ln -sf /dev/stderr /etc/nginx/logs/error.log
COPY build /etc/nginx/html/
RUN cp /etc/nginx/html/index.html /etc/nginx/html/index.html.tmpl

CMD ["/etc/nginx/docker-entrypoint.sh"]

#!/bin/bash
# Replace the window variables with desired runtime properties
/etc/nginx/replace_env_vars.sh /etc/nginx/html/index.html.tmpl /etc/nginx/html/index.html

exec nginx -g "daemon off;"
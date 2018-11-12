#!/bin/bash
set -euf

read_file="$1"
write_file="$2"
echo "Replacing window variables in $read_file into $write_file"

cp "$read_file" "$write_file"

# Find all REACT_APP variables in environment
variables=$(export | grep 'declare -x REACT_APP_' | sed 's/declare -x //')

for env in $variables; do
    key=$(cut -d'=' -f1 <<<"$env");
    escape_regex="s/\//\\\\\//g"
    value=$(echo "${!key}" | sed -e "$escape_regex")
    window_replacement="s/window.config.$key=\"\"/window.config.$key=\"$value\"/g"
    echo "Setting: $key to ${!key}"
    sed -i.bak -e "$window_replacement" "$write_file"
done

echo "All done!";
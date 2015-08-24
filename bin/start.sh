#!/bin/bash
export NODE_ENV=production

public_path='public/assets'

if [ ! -d $public_path ]; then
  echo "./dist directory not found. make sure to run 'npm run build' beforehand"
  exit 1
fi

if [ -d "$public_path/backup" ]; then
  # Restore js from previous build
  echo "restoring backup public files"
  cp $public_path/backup/*.js $public_path/

else
  # Backup js files before replacing
  mkdir -p $public_path/backup
  echo "backing up js files before replacing env"
  cp $public_path/*.js $public_path/backup/
fi


# Replace REPLACE__* with environment variable
while read -d $'\0' -r file; do
  echo "replacing environment variables in $file"
  while read line; do
    if [[ $line =~ REPLACE__([A-Z0-9_]+) ]]; then
      env_name="${BASH_REMATCH[1]}"
      env_value=$(echo $(eval "echo \$$env_name") | sed -e 's/[\/&]/\\&/g')
      echo "replacing $env_name with '$env_value'"
      sed -i s/REPLACE__$env_name/\"$env_value\"/g $file
    fi
  done < <(grep -o "REPLACE__[A-Z0-9_]\+" $file | uniq)
done < <(find $public_path -maxdepth 1 -iname '*.bundle.js' -print0)


PORT=3200 node server/index.js

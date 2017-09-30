#!/usr/bin/env bash

set -e

# Download senkyoku data

curl -o dl/senkyoku/CCAminToSenkyokuKokai.zip http://www.csis.u-tokyo.ac.jp/~nishizawa/senkyoku/CCAminToSenkyokuKokai.zip
unzip dl/senkyoku/CCAminToSenkyokuKokai.zip -d dl/senkyoku/
for file in `\find dl/senkyoku/CcAminToSenkyokuKokai/ -name *.csv`; do
  nkf -w $file > ${file}.utf8
done


# Download postal_code data

curl -o dl/postal_code/ken_all.zip http://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
unzip dl/postal_code/ken_all.zip -d dl/postal_code/
nkf -w dl/postal_code/KEN_ALL.CSV > dl/postal_code/KEN_ALL.CSV.utf8

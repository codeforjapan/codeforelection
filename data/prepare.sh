#!/usr/bin/env bash

set -e

curl -o dl/senkyoku/CCAminToSenkyokuKokai.zip http://www.csis.u-tokyo.ac.jp/~nishizawa/senkyoku/CCAminToSenkyokuKokai.zip
unzip dl/senkyoku/CCAminToSenkyokuKokai.zip -d dl/senkyoku/


curl -o dl/postal_code/ken_all.zip http://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
unzip dl/postal_code/ken_all.zip -d dl/postal_code/

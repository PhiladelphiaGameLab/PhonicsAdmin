#!/bin/bash
sudo rm /var/www/html/PhonicsAdmin/log.txt;
sudo cat /etc/httpd/logs/access_log-20150520 | grep -v "alpha" | grep -v "96.90." | grep "access" | grep -v "/Lux/" | grep -v ".css" | grep -v ".js" | grep -v ".ico" | sudo tee /var/www/html/PhonicsAdmin/log.txt;
sudo cat /etc/httpd/logs/access_log | grep -v "alpha" | grep -v "96.90." | grep "access" | grep -v "/Lux/" | grep -v ".css" | grep -v ".js" | grep -v ".ico" | sudo tee -a /var/www/html/PhonicsAdmin/log.txt;
#sudo tail -n50 /etc/httpd/logs/access_log | grep -v "alpha" | grep -v "96.90." | grep "access" | grep -v "/Lux/" | grep -v ".css" | grep -v ".js" | grep -v ".ico" | sudo tee -a /var/www/html/PhonicsAdmin/log.txt;

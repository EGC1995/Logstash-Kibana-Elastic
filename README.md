# Logstash-Kibana-Elastic
Dell 4 Senior Design Project - Gathering and Visualization of Server Metrics

# Installation / Setup
1. Download repo
2. Go to logstash-6.2.2/logstash-simple.conf and change the PATH on line 3 to the ABSOLUTE PATH of the data file used

# Operation
1. Go to elasticsearch-6.2.1 and run "bin/elasticsearch"
2. Navigate to kibana-6.2.1-linux-x86_64 from root and run "bin/kibana"
3. Go to logstash-6.2.2 and run "bin/logstash -f logstash-simple.conf" (or whatever .conf file you're using)
4. May need to update data files for them to populate ElasticSearch

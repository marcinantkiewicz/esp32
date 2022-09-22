# esp32
 - fermenter_controller: instrumentation for 22gal fermenter. Status: thermocouple reads 10F high. Heating pad relay works.
 - humidity_monitor: dht22 based logger. Functional, hardcodes everything. Requires data logging service.
 - data_logger: Node/Express service to receive data and offer them to prometheus. Functional.
 - prometheus: stub prometheus config, setup to scrape the data service.

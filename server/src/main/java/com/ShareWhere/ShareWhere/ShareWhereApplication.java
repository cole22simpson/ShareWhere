package com.ShareWhere.ShareWhere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
public class ShareWhereApplication {

	public static void main(String[] args) {
		// This run method will create a container to manage all specified components/classes. It will create instances of the classes in the container and manipulate them when necessary and destroy them at the end so you dont have to.
		SpringApplication.run(ShareWhereApplication.class, args);
	}

}

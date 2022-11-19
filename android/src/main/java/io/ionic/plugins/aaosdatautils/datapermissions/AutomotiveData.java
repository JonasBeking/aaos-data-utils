package io.ionic.plugins.aaosdatautils.datapermissions;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface AutomotiveData {
    int[] allowedIds() default {};
}

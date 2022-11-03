package io.ionic.plugins.aaosdatautils.dataerror;

import androidx.annotation.NonNull;

public class DataViewUnknownException extends RuntimeException{

    String addressableName;

    public DataViewUnknownException(String addressableName) {
        this.addressableName = addressableName;
    }

    @NonNull
    @Override
    public String toString() {
        return "DataView with name: " + addressableName + " is unknown";
    }
}

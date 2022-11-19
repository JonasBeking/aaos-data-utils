package io.ionic.plugins.aaosdatautils.dataerror;

import androidx.annotation.NonNull;

public class DataAccessDeniedException extends RuntimeException{

    private final int dataId;

    public DataAccessDeniedException(Integer dataId) {
        this.dataId = dataId;
    }

    @NonNull
    @Override
    public String toString() {
        return "Could not access dataId: " + this.dataId;
    }
}

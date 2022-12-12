package io.ionic.plugins.aaosdatautils.dataerror;
import androidx.annotation.NonNull;

public class DataViewRegisterException extends RuntimeException{

    int dataId;

    public DataViewRegisterException(int dataId) {
        this.dataId = dataId;
    }

    @NonNull
    @Override
    public String toString() {
        return "Could not register view for id: " + String.valueOf(dataId);
    }
}

package io.ionic.plugins.aaosdatautils;

import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import io.ionic.plugins.aaosdatautils.dataerror.DataAccessDeniedException;
import io.ionic.plugins.aaosdatautils.dataerror.DataErrorHandler;
import io.ionic.plugins.aaosdatautils.dataerror.MissingPluginCallArgumentException;
import io.ionic.plugins.aaosdatautils.dataevent.DataEvent;
import io.ionic.plugins.aaosdatautils.datapermissions.AutomotiveData;
import io.ionic.plugins.aaosdatautils.dataservice.PluginCallProcessingChain;
import io.ionic.plugins.aaosdatautils.dataview.DataViewManager;


public class DataPlugin<T> extends Plugin {

    private static final String TAG = "DataPlugin";

    protected DataViewManager<T> dataViewManager;
    protected DataErrorHandler dataErrorHandler;
    protected PluginCallProcessingChain processingChain;

    @Override
    public void load() {
        super.load();
        this.processingChain = new PluginCallProcessingChain(this.dataErrorHandler);
        this.processingChain.add(pluginCall -> {
           if(pluginCall.hasOption("dataId")) {
               Integer dataId = pluginCall.getInt("dataId");
               if(dataId == null) {
                   Log.e(TAG,"PluginCall is missing argument: dataId");
                   throw new MissingPluginCallArgumentException("dataId");
               }
               AutomotiveData automotiveData = this.getClass().getAnnotation(AutomotiveData.class);
               if(automotiveData == null) {
                   Log.e(TAG,"DataPlugin is missing required AutomotiveData Annotation");
                   throw new UnknownError("DataPlugin is missing or has incomplete AutomotiveData Annotation");
               }

               for(int allowedId : automotiveData.allowedIds()) {
                   if (dataId == allowedId) {
                       return;
                   }
               }
               Log.e(TAG,"Access to dataId: " + dataId + " was denied");
               throw new DataAccessDeniedException(dataId);
           }
        });
    }

    /**
     * Split up from generatePassiveView because of different Handling on JS-Side and the need for a
     * declaration in form of an annotation
     */
    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void generateActiveView(PluginCall call) {
        this.processingChain.executeWithFinal(call, pluginCall -> {
            Integer dataId = pluginCall.getInt("dataId");
            String addressableName = pluginCall.getString("addressableName");
            if(dataId == null) {
                throw new MissingPluginCallArgumentException("dataId");
            }
            this.dataViewManager.generate(pluginCall,dataId,addressableName,true);
        });
    }

    @PluginMethod()
    public void generatePassiveView(PluginCall call) {
        this.processingChain.executeWithFinal(call, pluginCall -> {
            Integer dataId = pluginCall.getInt("dataId");
            String addressableName = pluginCall.getString("addressableName");
            if(dataId == null) {
                throw new MissingPluginCallArgumentException("dataId");
            }
            this.dataViewManager.generate(pluginCall,dataId,addressableName,false);
            pluginCall.resolve();

        });
    }

    @PluginMethod()
    public void removeView(PluginCall call) {
        this.processingChain.executeWithFinal(call, pluginCall -> {
            String addressableName = pluginCall.getString("addressableName");
            if(addressableName == null) {
                throw new MissingPluginCallArgumentException("addressableName");
            }
            this.dataViewManager.remove(addressableName,this.getBridge());
            pluginCall.resolve();
        });
    }

    @PluginMethod()
    public void view(PluginCall call) {
        this.processingChain.executeWithFinal(call,pluginCall -> {
            String addressableName = pluginCall.getString("addressableName");
            if(addressableName == null) {
                throw new MissingPluginCallArgumentException("addressableName");
            }
            DataEvent value = this.dataViewManager.view(addressableName);
            pluginCall.resolve(value);
        });
    }

    @PluginMethod()
    void viewAll(PluginCall call) {
        this.processingChain.executeWithFinal(call,pluginCall -> {
            String addressableName = pluginCall.getString("addressableName");
            if(addressableName == null) {
                throw new MissingPluginCallArgumentException("addressableName");
            }
            JSArray allEvents = this.dataViewManager.viewAll(addressableName);
            JSObject ret = new JSObject();
            ret.put("events",allEvents);
            pluginCall.resolve(ret);
        });
    }
}

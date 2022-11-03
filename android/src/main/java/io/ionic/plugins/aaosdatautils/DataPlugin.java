package io.ionic.plugins.aaosdatautils;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import io.ionic.plugins.aaosdatautils.dataerror.DataErrorHandler;
import io.ionic.plugins.aaosdatautils.dataerror.MissingPluginCallArgumentException;
import io.ionic.plugins.aaosdatautils.dataservice.PluginCallProcessingChain;
import io.ionic.plugins.aaosdatautils.dataview.DataViewManager;


public class DataPlugin<T> extends Plugin {

    protected DataViewManager<T> dataViewManager;
    protected DataErrorHandler dataErrorHandler;
    protected PluginCallProcessingChain processingChain;

    @Override
    public void load() {
        super.load();
        this.processingChain = new PluginCallProcessingChain(this.dataErrorHandler);
    }

    /**
     * Split up from generatePassiveView because of different Handling on JS-Side and the need for a
     * declaration in form of an annotation
     */
    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    void generateActiveView(PluginCall call) {
        this.processingChain.executeWithFinal(call, pluginCall -> {
            Integer dataId = pluginCall.getInt("dataId");
            String addressableName = pluginCall.getString("addressableName");
            if(dataId == null) {
                throw new MissingPluginCallArgumentException("dataId");
            }
            this.dataViewManager.generate(pluginCall,dataId,addressableName,true,true);
        });
    }

    @PluginMethod()
    void generatePassiveView(PluginCall call) {
        this.processingChain.executeWithFinal(call, pluginCall -> {
            Integer dataId = pluginCall.getInt("dataId");
            String addressableName = pluginCall.getString("addressableName");
            Boolean overwriteOldEvents = pluginCall.getBoolean("overwriteOldEvents");
            if(dataId == null) {
                throw new MissingPluginCallArgumentException("dataId");
            }
            if(overwriteOldEvents == null) {
                throw new MissingPluginCallArgumentException("overwriteOldEvents");
            }
            this.dataViewManager.generate(pluginCall,dataId,addressableName,false,overwriteOldEvents);
            pluginCall.resolve();

        });
    }

    @PluginMethod()
    void removeView(PluginCall call) {
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
    void view(PluginCall call) {
        this.processingChain.executeWithFinal(call,pluginCall -> {
            String addressableName = pluginCall.getString("addressableName");
            if(addressableName == null) {
                throw new MissingPluginCallArgumentException("addressableName");
            }
            JSObject value = this.dataViewManager.view(addressableName);
            pluginCall.resolve(value);
        });
    }

    @PluginMethod()
    void setDataViewOverwriteOldEvents(PluginCall call)  {
        this.processingChain.executeWithFinal(call,pluginCall -> {
            String addressableName = pluginCall.getString("addressableName");
            Boolean overwriteOldEvents = pluginCall.getBoolean("overwriteOldEvents");
            if(addressableName == null) {
                throw new MissingPluginCallArgumentException("addressableName");
            }
            if(overwriteOldEvents == null) {
                throw new MissingPluginCallArgumentException("overwriteOldEvents");
            }
            this.dataViewManager.setDataViewOverwriteOldEvents(addressableName,overwriteOldEvents);
            pluginCall.resolve();
        });
    }
}

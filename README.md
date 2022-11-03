# aaos-data-utils

Data Utils for communicating with Android Automotive OS

## Install

```bash
npm install aaos-data-utils
npx cap sync
```

## API

<docgen-index>

* [`generateActiveView(...)`](#generateactiveview)
* [`generatePassiveView(...)`](#generatepassiveview)
* [`removeView(...)`](#removeview)
* [`view(...)`](#view)
* [`setDataViewOverwriteOldEvents(...)`](#setdataviewoverwriteoldevents)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### generateActiveView(...)

```typescript
generateActiveView(options: { dataId: number; addressableName?: string; }, callback: DataViewCallback<VehicleDataEventType>) => Promise<CallbackID>
```

Generates an active view on the side of android: The view will pass data on a callback so no active polling is
required on the WebView side

| Param          | Type                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| **`options`**  | <code>{ dataId: number; addressableName?: string; }</code>                                |
| **`callback`** | <code><a href="#dataviewcallback">DataViewCallback</a>&lt;VehicleDataEventType&gt;</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### generatePassiveView(...)

```typescript
generatePassiveView(options: { dataId: number; overwriteOldEvents: boolean; addressableName?: string; }) => Promise<void>
```

Generates an active view on the side of android: The view will not pass data on a callback so active polling is
required on the WebView side

| Param         | Type                                                                                    |
| ------------- | --------------------------------------------------------------------------------------- |
| **`options`** | <code>{ dataId: number; overwriteOldEvents: boolean; addressableName?: string; }</code> |

--------------------


### removeView(...)

```typescript
removeView(options: { addressableName: string; }) => Promise<void>
```

Removes a view previously generated

| Param         | Type                                      |
| ------------- | ----------------------------------------- |
| **`options`** | <code>{ addressableName: string; }</code> |

--------------------


### view(...)

```typescript
view(options: { addressableName: string; }) => Promise<VehicleDataEventType | VehicleErrorEvent>
```

Gets the value of a previously registered view.

| Param         | Type                                      |
| ------------- | ----------------------------------------- |
| **`options`** | <code>{ addressableName: string; }</code> |

**Returns:** <code>Promise&lt;VehicleDataEventType | <a href="#vehicleerrorevent">VehicleErrorEvent</a>&gt;</code>

--------------------


### setDataViewOverwriteOldEvents(...)

```typescript
setDataViewOverwriteOldEvents(options: { addressableName: string; overwriteOldEvents: boolean; }) => Promise<void>
```

Tell a registered view to discord or keep old events to poll later on

| Param         | Type                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| **`options`** | <code>{ addressableName: string; overwriteOldEvents: boolean; }</code> |

--------------------


### Interfaces


#### VehicleErrorEvent

| Prop            | Type                 |
| --------------- | -------------------- |
| **`timestamp`** | <code>number</code>  |
| **`event`**     | <code>'error'</code> |
| **`reason`**    | <code>string</code>  |


### Type Aliases


#### DataViewCallback

<code>(message: VehicleDataEventType | null, err?: any): void</code>


#### CallbackID

<code>string</code>

</docgen-api>

/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1180e750017db4c49130"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(70)(__webpack_require__.s = 70);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vec = new Vector()) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  minus(vec = new Vector()) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  multiply(val = 0) {
    if (typeof val === 'object') {
      this.x *= val.x;
      this.y *= val.y;
    } else {
      this.x *= val;
      this.y *= val;
    }
    return this;
  }

  fixed(amount = 0) {
    this.x = Number(this.x.toFixed(amount));
    this.y = Number(this.y.toFixed(amount));
    return this;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Vector);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let settings = {

  display: {
    // fullscreen: true,
    width: 1000,
    height: 600

    // width: 1920,
    // height: 1080,

    // width: 640,
    // height: 480,
  },

  camera: {
    deadZone: {
      width: 200,
      height: 350
    }

    // showDeadZone: true,
  },

  // schematicalView: true,
  // showCollisionsMap: true,
  // showPlayerBox: true,
  drawMap: true,

  map: {
    tileSize: 16
  },

  gravity: 0.75,
  windage: 0.93

};

/* harmony default export */ __webpack_exports__["a"] = (settings);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings_js__ = __webpack_require__(1);



class Character {

  constructor(position, APP) {
    this.APP = APP;
    this.position = position;
    this.speed = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */]();
    this.maxSpeed = 5;
    this.acceleration = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */]();
    this.width = 16;
    this.height = 64;
    this.oldPosition = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */]();
    this.timeoutBeforeJump = 100;
    this.center = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.isOnPlatform = null;
    this.platform = null;
    this.nearbyHole = true;
    this.collisions = true;
    this.aggression = null;

    this.status = {
      damage: false,
      direction: 'right',
      jump: false,
      onPlatform: false,
      run: 'wait'
    };

    this.collisionStatus = null;
  }

  addSprite(sprite) {
    this.sprite = sprite;
    this.sprite.parent = this;
    this.sprite.init();
  }

  damage(direction) {
    this.status.damage = true;
    this.status.onPlatform = false;

    let _direction;

    if (direction) {
      _direction = direction;
    } else {
      _direction = this.status.direction;
    };

    if (_direction === 'left') {
      this.position.y -= 10;
      this.speed.y = -15;
      this.speed.x = 15;
    };

    if (_direction === 'right') {
      this.position.y -= 10;
      this.speed.y = -15;
      this.speed.x = -15;
    }

    this.APP.scene.camera.shake();
  }

  checkOnPlatform() {
    for (let platform of this.APP.tilesMap.collisionsMap) {

      if (platform.position.x < this.position.x + this.width && platform.position.x + platform.width > this.position.x && platform.position.y === this.position.y + this.height) {

        if (!this.status.jump) {
          this.isOnPlatform = true;
          this.platform = platform;
        } else {
          this.isOnPlatform = false;
        }

        break;
      } else {
        this.isOnPlatform = false;
        this.platform = null;
      }
    }
  }

  checkNearbyHole() {
    this.nearbyHole = false;

    if (!this.platform) {
      return;
    };

    if (this.status.direction === 'left') {
      if (this.platform.position.x === this.position.x) {
        this.nearbyHole = 'left';
      };
    };

    if (this.status.direction === 'right') {
      if (this.platform.position.x + this.platform.width === this.position.x + this.width) {
        this.nearbyHole = 'right';
      };
    };
  }

  checkAggression() {
    if (this.type === 'player') {
      return;
    };

    let player = this.APP.scene.player;
    let distance;
    let side;

    if (this.platform === player.platform) {
      if (this.position.x > player.position.x) {
        side = 'left';
        distance = this.position.x - player.position.x;
      } else if (this.position.x < player.position.x) {
        side = 'right';
        distance = player.position.x - this.position.x;
      };

      if (distance < 300) {
        this.aggression = side;
      } else {
        this.aggression = false;
      }
    } else {
      this.aggression = false;
    }
  }

  update() {
    // this.checkCollisions();
    this.checkOnPlatform();
    this.checkNearbyHole();
    this.checkAggression();

    // Включить гравитацию, если игрок в воздухе
    // if (this.status.onPlatform === false
    if (!this.isOnPlatform && !this.isInTransport) {
      this.acceleration.y = __WEBPACK_IMPORTED_MODULE_1__settings_js__["a" /* default */].gravity;
    } else {
      this.acceleration.y = 0;
      this.speed.y = 0;
    };

    // Если ускорения нет, включить сопротивление воздуха
    if (this.acceleration.x === 0) {
      this.speed.multiply({
        x: __WEBPACK_IMPORTED_MODULE_1__settings_js__["a" /* default */].windage,
        y: 1
      }).fixed(2);
    };

    // Ускорение
    this.speed.plus(this.acceleration);

    // Лимит скорости
    if (this.speed.x > this.maxSpeed) {
      this.speed.x = this.maxSpeed;
    };

    if (this.speed.y > 40) {
      this.speed.y = 40;
    };

    if (this.speed.x < -this.maxSpeed) {
      this.speed.x = -this.maxSpeed;
    };

    this.setStatus();

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;

    // Изменение позиции
    this.position.plus(this.speed).fixed(0);

    this.center.x = this.position.x + this.width / 2;
    this.center.y = this.position.y + this.height / 2;
  }

  draw(ctx) {

    if (this.APP.settings.showPlayerBox === true && this.type === 'player') {
      ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    };

    this.sprite.update();

    ctx.drawImage(this.sprite.image, Math.round(this.sprite.x), Math.round(this.sprite.y), this.sprite.frameWidth, this.sprite.frameHeight, Math.round(this.position.x - (this.sprite.frameWidth - this.width) / 2), Math.round(this.position.y), this.sprite.frameWidth, this.sprite.frameHeight);

    if (this.pupils) {
      ctx.fillStyle = "black";
      ctx.strokeStyle = "red";

      ctx.beginPath();
      ctx.arc(this.pupils[0].position.x, this.pupils[0].position.y, this.pupils[0].width, 0, 2 * Math.PI, false);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.pupils[1].position.x, this.pupils[1].position.y, this.pupils[1].width, 0, 2 * Math.PI, false);
      ctx.fill();
    };

    if (this.transport) {
      this.transport.draw(ctx);
    }
  }

  jump() {
    if (this.status.jump === false && this.isOnPlatform) {
      this.status.jump = true;
      this.status.beforeJump = true;

      let that = this;

      this.APP.timeout(function () {
        that.status.onPlatform = false;
        that.status.beforeJump = false;
        that.position.y -= 10;
        that.speed.y = -15;
      }, that.timeoutBeforeJump);
    };
  }

  spring(val = 15) {
    this.status.jump = true;
    this.status.onPlatform = false;
    this.status.beforeJump = false;
    this.position.y -= 10;
    this.speed.y = -val;
  }

  setStatus() {}
};

/* harmony default export */ __webpack_exports__["a"] = (Character);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);


class Element {

    constructor(file, name, width, height, globalPosition, localPosition, APP) {
        this.APP = APP;

        this.file = file;
        this.width = width;
        this.height = height;
        this.globalPosition = globalPosition;
        this.position = globalPosition;
        this.localPosition = localPosition;
        this.image = new Image();
        this.image.src = this.file;

        this.parallaxOffset = {
            x: 0,
            y: 0
        };

        this.new = true;

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };

        this.name = name;

        let that = this;

        this.loaded = false;

        if (this.name !== 'cloud') {
            this.image.onload = function () {
                that.data = that.APP.prerender.getData(that.image, that.localPosition.x, that.localPosition.y, that.width, that.height, 0, 0, that.width, that.height);
                that.backData = that.APP.prerender.filter(that.data, 'fog', 0.5);
                that.backData2 = that.APP.prerender.filter(that.data, 'fog', 0.8);
                that.frontData2 = that.APP.prerender.filter(that.data, 'brightness', -0.3);
                that.loaded = true;
            };
        } else {
            this.loaded = true;
        };
    }

    draw(ctx) {
        if (!this.loaded) {
            return;
        }

        let k = this.layer.parallax;

        if (k > 0.9) {
            k = 0.9;
        } else if (k < 0) {
            k = 0;
        };

        let cameraCenterX = this.APP.camera.position.x + this.APP.scene.width / 2;
        let cameraCenterY = this.APP.camera.position.y + this.APP.scene.height / 2;

        this.parallaxOffset.x = (cameraCenterX - this.center.x) * k;
        this.parallaxOffset.y = (cameraCenterY - this.center.y) * k;

        if (this.new) {
            // this.position.x -= this.parallaxOffset.x;
            // this.position.y -= this.parallaxOffset.y;
        };

        this.positionWithOffset = {
            x: this.position.x + this.parallaxOffset.x,
            y: this.position.y + this.parallaxOffset.y
        };

        if (this.layer.zType === 'back-2') {
            this.APP.prerender.draw(this.backData2, this.positionWithOffset);
        };

        if (this.layer.zType === 'back') {
            this.APP.prerender.draw(this.backData, this.positionWithOffset);
        };

        if (this.layer.zType === 'middle') {
            ctx.drawImage(this.image, this.localPosition.x, this.localPosition.y, this.width, this.height, this.positionWithOffset.x, this.positionWithOffset.y, this.width, this.height);
        };

        if (this.layer.zType === 'front') {
            ctx.drawImage(this.image, this.localPosition.x, this.localPosition.y, this.width, this.height, this.positionWithOffset.x, this.positionWithOffset.y, this.width, this.height);
        };

        if (this.layer.zType === 'front-2') {
            this.APP.prerender.draw(this.frontData2, this.positionWithOffset);
        };

        if (this.layer.zType === 'clouds') {
            ctx.drawImage(this.image, this.localPosition.x, this.localPosition.y, this.width, this.height, this.positionWithOffset.x, this.positionWithOffset.y, this.width, this.height);
        };

        this.new = false;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Element);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Layer {

  constructor(name, type, zIndex, zType, parallax, APP) {
    this.name = name;
    this.type = type;
    this.zIndex = zIndex;
    this.items = [];
    this.visibleItems = [];
    this.visible = true;
    this.sectors = [];
    this.APP = APP;
    this.zType = zType;
    this.parallax = parallax;
  }

  add(item) {
    this.items.push(item);
    this.sectorize(500);
  }

  delete(item) {
    let index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    };
    this.sectorize(500);
  }

  draw(ctx) {
    if (!this.visible) {
      return;
    };

    if (this.type !== 'tiles') {

      for (let item of this.items) {

        if (!item.driver) {
          item.layer = this;
          item.draw(ctx);
        };
      };
    } else {

      for (let item of this.visibleItems) {
        if (item.item !== '00|01') {
          ctx.strokeStyle = "#e9e9e9";
          ctx.strokeRect(item.position.x, item.position.y, item.width, item.height);
        }
      };

      for (let item of this.visibleItems) {
        if (item.item === '00|01') {
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
          ctx.strokeRect(item.position.x, item.position.y, item.width, item.height);

          ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
          ctx.fillRect(item.position.x, item.position.y, item.width, item.height);
        }
      }
    }

    if (this.type === 'characters') {}
  }

  sectorize(sectorSize) {

    this.sectors = {};

    for (let item of this.items) {
      let floor = function (val, k) {
        return Math.floor(val / k) * k;
      };

      let keyX = floor(item.position.x, sectorSize);
      let keyY = floor(item.position.y, sectorSize);

      let key = keyX + 'x' + keyY;

      item.sector = {};

      item.sector.x = keyX;
      item.sector.y = keyY;

      if (this.sectors[key]) {
        this.sectors[key].push(item);
      } else {
        this.sectors[key] = [];
        this.sectors[key].push(item);
      };
    };

    let sectors = [];

    for (let p in this.sectors) {
      let sector = {};
      sector.position = {};

      sector.items = this.sectors[p];
      sector.position.x = this.sectors[p][0].sector.x;
      sector.position.y = this.sectors[p][0].sector.y;
      sector.size = sectorSize;

      sectors.push(sector);
    };

    this.sectors = sectors;
  }

};

/* harmony default export */ __webpack_exports__["a"] = (Layer);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);



class GameMap {

  constructor(data, APP) {
    this.APP = APP;
    this.data = data;
    this.tileSize = __WEBPACK_IMPORTED_MODULE_0__settings_js__["a" /* default */].map.tileSize;

    this.collisionsData = this.combine();
    this.collisionsMap = this.generateCollisionsMap();

    this.sectors = {};
    this.sectorsArr = [];
  }

  combine() {
    let collisionsData = [];

    for (let item in this.data) {
      collisionsData[item] = [...this.data[item]];

      for (var i = 0; i < collisionsData[item].length; i++) {
        if (Number(collisionsData[item][i].split('|')[1]) !== 0) {
          collisionsData[item][i] = 1;
        } else if (Number(collisionsData[item][i].split('|')[1]) === 0) {
          collisionsData[item][i] = 0;
        };
      };
    };

    let prevItem = null;

    for (let rowIndex in collisionsData) {
      prevItem = null;

      let row = collisionsData[rowIndex];

      for (var i = 0; i < row.length; i++) {
        let item = row[i];

        if (item === 1 && prevItem !== 1) {
          prevItem = 1;
        } else if (item === 1 && prevItem === 1) {
          row[i - 1] += 1;
          row.splice(i, 1);
          i--;
        } else if (item !== 1) {
          prevItem = 0;
        }
      };
    };

    return collisionsData;
  }

  drawTile(ctx, type, adress) {
    if (__WEBPACK_IMPORTED_MODULE_0__settings_js__["a" /* default */].schematicalView) {
      ctx.strokeRect(adress.x, adress.y, this.tileSize, this.tileSize);
    } else {
      ctx.fillRect(adress.x, adress.y, this.tileSize, this.tileSize);
    }
  }

  getTiles(sectorSize) {
    let that = this;
    let adress = {};

    let tiles = [];

    adress.x = -that.tileSize;
    adress.y = -that.tileSize;

    this.data.forEach(function (item) {
      adress.x = -that.tileSize;
      adress.y += that.tileSize;

      item.forEach(function (item, i, arr) {
        adress.x += that.tileSize;

        let tile = {};
        tile.x = adress.x;
        tile.y = adress.y;

        tile.position = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](adress.x, adress.y);

        tile.type = 'tile';

        tile.width = that.tileSize;
        tile.height = that.tileSize;
        tile.item = item;

        tiles.push(tile);

        that.sectorize(tile, sectorSize);
      });
    });

    let sectors = [];

    for (let p in this.sectors) {
      let sector = {};
      sector.position = {};

      sector.items = this.sectors[p];
      sector.position.x = this.sectors[p][0].sector.x;
      sector.position.y = this.sectors[p][0].sector.y;
      sector.size = sectorSize;

      sectors.push(sector);
    };

    let data = {
      sectors: sectors,
      tiles: tiles
    };

    return data;
  }

  sectorize(tile, sectorSize) {
    let floor = function (val, k) {
      return Math.floor(val / k) * k;
    };

    let keyX = floor(tile.position.x, sectorSize);
    let keyY = floor(tile.position.y, sectorSize);

    let key = keyX + 'x' + keyY;

    tile.sector = {};
    tile.sector.x = keyX;
    tile.sector.y = keyY;

    if (this.sectors[key]) {
      this.sectors[key].push(tile);
    } else {
      this.sectors[key] = [];
      this.sectors[key].push(tile);
    };
  }

  drawMap(ctx, scene) {
    var that = this;
    scene.visibleTiles = [];

    var adress = {};
    adress.x = 0;
    adress.y = 0;

    this.data.forEach(function (item) {
      adress.x = 0;
      adress.y += that.tileSize;

      item.forEach(function (item, i, arr) {
        adress.x += that.tileSize;

        let tile = {};
        tile.x = adress.x;
        tile.y = adress.y;
        tile.width = that.tileSize;
        tile.height = that.tileSize;

        tile.visible = that.checkVisibleTiles(tile, scene.camera);

        if (tile.visible === true) {

          if (item === 1) {
            scene.visibleTiles.push(tile);
            that.drawTile(ctx, 10, adress);
          }
        };
      });
    });
  }

  // generateCollisionsMap() {
  //   let that = this;
  //   let tilesCollision = [];
  //   let prevItem = null;
  //   let adress = {};

  //   adress.x = 0;
  //   adress.y = 0;

  //   this.collisionsData.forEach(function(item){

  //     prevItem = null;

  //     adress.x = 0;
  //     adress.y += that.tileSize;

  //     item.forEach(function (item, i, arr) {

  //       if (prevItem) {
  //         adress.x += that.tileSize * prevItem;

  //       } else {
  //         adress.x += that.tileSize;
  //       }

  //       var tile = {};
  //       tile.x = adress.x;
  //       tile.y = adress.y;

  //       tile.type = 'tile';

  //       tile.position = new Vector(adress.x, adress.y);

  //       if (item === 0) {
  //         tile.width = that.tileSize;

  //       } else{
  //         tile.width = that.tileSize * item;
  //       }

  //       tile.height = that.tileSize;

  //       if (item !== 0) {
  //         tilesCollision.push(tile);
  //       }

  //       prevItem = item;
  //     })
  //   })

  //   return tilesCollision;
  // };

  generateCollisionsMap() {
    let that = this;
    let tilesCollision = [];
    let prevItem = null;
    let adress = {};

    adress.x = -that.tileSize;
    adress.y = -that.tileSize;

    this.collisionsData.forEach(function (item) {

      prevItem = null;

      adress.x = -that.tileSize;
      adress.y += that.tileSize;

      item.forEach(function (item, i, arr) {

        if (prevItem) {
          adress.x += that.tileSize * prevItem;
        } else {
          adress.x += that.tileSize;
        }

        var tile = {};
        tile.x = adress.x;
        tile.y = adress.y;

        tile.type = 'tile';

        tile.position = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](adress.x, adress.y);

        if (item === 0) {
          tile.width = that.tileSize;
        } else {
          tile.width = that.tileSize * item;
        }

        tile.height = that.tileSize;

        if (item !== 0) {
          tilesCollision.push(tile);
        }

        prevItem = item;
      });
    });

    return tilesCollision;
  }

  checkVisibleTiles(tile, camera) {
    if (tile.x + 100 > camera.getScope().x1 && tile.x - 100 < camera.getScope().x2 && tile.y + 100 > camera.getScope().y1 && tile.y - 100 < camera.getScope().y2) {
      return true;
    } else {
      return false;
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (GameMap);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(21);
exports = module.exports = __webpack_require__(20)(false);
// imports


// module
exports.push([module.i, "body {\n  background: #000;\n  width: 100%;\n  height: 100%;\n}\n.ctx {\n  background-image: url(" + escape(__webpack_require__(65)) + ");\n  background-size: 100%;\n  width: 1180px;\n  height: 680px;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n}\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ? parseInt(entity.substr(2).toLowerCase(), 16) : parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.decode = function (str) {
    return new Html5Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.encode = function (str) {
    return new Html5Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.encodeNonUTF = function (str) {
    return new Html5Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.encodeNonASCII = function (str) {
    return new Html5Entities().encodeNonASCII(str);
};

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = chr < 32 || chr > 126 || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings_js__ = __webpack_require__(1);



class Bullet {
  constructor(position, width, height, speed, shooter, APP) {
    this.position = position;
    this.speed = speed;
    this.APP = APP;
    this.width = width;
    this.height = height;
    this.loss = 1;
    this.APP.scene.addBullet(this);
    this.shooter = shooter;
  }

  update() {
    this.position.plus(this.speed).fixed(0);
  }

  draw(ctx) {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  delete() {
    this.APP.scene.removeBullet(this);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Bullet);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__element_js__ = __webpack_require__(3);




class Cloud extends __WEBPACK_IMPORTED_MODULE_2__element_js__["a" /* default */] {
  constructor(position, speed, type, layer, APP) {
    super('./images/clouds.png', 'cloud', 600, 250, position, new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](0, 0), APP);
    this.speed = speed;
    this.layer = layer;
    this.localPosition.y = type * 250;
  }

  update() {
    this.position.plus(this.speed).fixed(1);
    if (this.position.x < -2000) {
      this.delete();
    };
  }

  delete() {
    let index = this.layer.items.indexOf(this);
    if (index !== -1) {
      this.layer.items.splice(index, 1);
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Cloud);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let detector = function (obj_1, obj_2, callback) {

  let type = {};
  let t1;
  let t2;
  let it;

  // get the vectors to check against
  let vX = obj_2.position.x + obj_2.width / 2 - (obj_1.position.x + obj_1.width / 2),
      vY = obj_2.position.y + obj_2.height / 2 - (obj_1.position.y + obj_1.height / 2),

  // add the half widths and half heights of the objects
  hWidths = obj_2.width / 2 + obj_1.width / 2,
      hHeights = obj_2.height / 2 + obj_1.height / 2,
      colDir = null;
  // type = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "top";
        type.y = 'top';
        t1 = 'top';
        t2 = 'bottom';
        // obj_2.position.y += oY;
      } else {
        colDir = "bottom";
        type.y = 'bottom';
        t1 = 'bottom';
        t2 = 'top';
        // obj_2.position.y -= oY;
      }
    } else {
      if (vX > 0) {
        colDir = "left";
        type.x = 'left';
        t1 = 'left';
        t2 = 'right';
        // obj_2.position.x += oX;
      } else {

        colDir = "right";
        type.x = 'right';
        t1 = 'right';
        t2 = 'left';
        // obj_2.position.x -= oX;
      };
    };
  } else {
    t1 = false;
    t2 = false;
  };

  callback(obj_1, obj_2, t1, t2);
};

let collisionsDetector = {

  detection: (dynamicObjects, staticObjects, callback) => {

    dynamicObjects.forEach(function (dynamicObj, i, arr) {
      staticObjects.forEach(function (staticObj, i, arr) {
        detector(staticObj, dynamicObj, callback);
      });

      dynamicObjects.forEach(function (dynamicObj_2, i, arr) {
        if (dynamicObj === dynamicObj_2) {
          return;
        };

        if (!dynamicObj.collisions || !dynamicObj_2.collisions) {
          return;
        };

        detector(dynamicObj_2, dynamicObj, callback);
      });
    });
  }

};

/* harmony default export */ __webpack_exports__["a"] = (collisionsDetector);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const KEYS = {
  13: 'ENTER',

  37: 'LEFT',
  38: 'TOP',
  39: 'RIGHT',
  40: 'BOTTOM',

  65: 'A',
  87: 'W',
  68: 'D',
  83: 'S',

  80: 'P',

  17: 'CTRL',
  32: 'SPACE'
};

let pressedKeys = [];

let keyboard = {

  listen: callback => {
    document.addEventListener('keydown', function (event) {
      if (KEYS[event.keyCode] != undefined && pressedKeys.indexOf(KEYS[event.keyCode]) === -1) {
        pressedKeys.push(KEYS[event.keyCode]);
        callback(pressedKeys, KEYS[event.keyCode]);
      };
    });

    document.addEventListener('keyup', function (event) {
      if (KEYS[event.keyCode] != undefined) {
        pressedKeys.splice(pressedKeys.indexOf(KEYS[event.keyCode]), 1);
        callback(pressedKeys);
      };
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (keyboard);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tiles_json__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tiles_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__tiles_json__);


class Tile {

  constructor(index, position, APP) {
    this.APP = APP;

    this.image = this.APP.images.tiles;
    this.width = this.APP.settings.map.tileSize;
    this.height = this.APP.settings.map.tileSize;
    this.position = position;
    this.index = index;
    this.collision = null;
    this.type = null;

    this.sprite = {
      width: __WEBPACK_IMPORTED_MODULE_0__tiles_json___default.a.tiles.width,
      height: __WEBPACK_IMPORTED_MODULE_0__tiles_json___default.a.tiles.height
    };

    this.readIndex();
  }

  readIndex() {
    let indexArray = this.index.split('|');
    let type = indexArray[0];

    this.collisions = Number(indexArray[0]);
    this.sprite.x = __WEBPACK_IMPORTED_MODULE_0__tiles_json___default.a.tiles.types[type].x * __WEBPACK_IMPORTED_MODULE_0__tiles_json___default.a.tiles.width;
    this.sprite.y = __WEBPACK_IMPORTED_MODULE_0__tiles_json___default.a.tiles.types[type].y * __WEBPACK_IMPORTED_MODULE_0__tiles_json___default.a.tiles.height;
  }

  draw(ctx) {
    if (!this.collisions) {
      return;
    };

    ctx.drawImage(this.image, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.position.x, this.position.y, this.width, this.height);
  }
};

/* unused harmony default export */ var _unused_webpack_default_export = (Tile);

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = [{"name":"platform_1","image":"images/tiles.png","width":234,"height":73,"coords":{"x":0,"y":0}},{"name":"platform_2","image":"images/tiles.png","width":128,"height":96,"coords":{"x":128,"y":0}},{"name":"platform_3","image":"images/tiles.png","width":128,"height":96,"coords":{"x":256,"y":0}},{"name":"ground","image":"images/tiles.png","width":128,"height":96,"coords":{"x":384,"y":0}},{"name":"platform_4","image":"images/tiles.png","width":160,"height":144,"coords":{"x":0,"y":112}},{"name":"tree","image":"images/tiles.png","width":255,"height":440,"coords":{"x":165,"y":110}},{"name":"wood-bridge-barrier-1","image":"images/tiles.png","width":50,"height":66,"coords":{"x":512,"y":0}},{"name":"wood-bridge-barrier-2","image":"images/tiles.png","width":80,"height":66,"coords":{"x":560,"y":0}},{"name":"wood-bridge-barrier-3","image":"images/tiles.png","width":55,"height":66,"coords":{"x":640,"y":0}},{"name":"wood-bridge-1","image":"images/tiles.png","width":200,"height":97,"coords":{"x":512,"y":98}},{"name":"wood-bridge-2","image":"images/tiles.png","width":175,"height":97,"coords":{"x":712,"y":98}},{"name":"wood-bridge-3","image":"images/tiles.png","width":200,"height":97,"coords":{"x":886,"y":98}}]

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {"tiles":{"framesAmount":13,"width":16,"height":16,"image":"images/tiles.png","types":{"10":{"x":10,"y":0},"11":{"x":11,"y":0},"12":{"x":9,"y":1},"13":{"x":11,"y":1},"00":{"x":0,"y":0},"01":{"x":1,"y":0},"02":{"x":2,"y":0},"03":{"x":3,"y":0},"04":{"x":4,"y":0},"05":{"x":5,"y":0},"06":{"x":6,"y":0},"07":{"x":7,"y":0},"08":{"x":8,"y":0},"09":{"x":9,"y":0}}}}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__resourceQuery) {

/* global __resourceQuery WorkerGlobalScope self */
/* eslint prefer-destructuring: off */

var url = __webpack_require__(34);
var stripAnsi = __webpack_require__(32);
var log = __webpack_require__(26).getLogger('webpack-dev-server');
var socket = __webpack_require__(37);
var overlay = __webpack_require__(36);

function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  }
  // Fall back to getting all scripts in the document.
  var scriptElements = document.scripts || [];
  var currentScript = scriptElements[scriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  }
  // Fail as there was no script to use.
  throw new Error('[WDS] Failed to get current script source.');
}

var urlParts = void 0;
var hotReload = true;
if (typeof window !== 'undefined') {
  var qs = window.location.search.toLowerCase();
  hotReload = qs.indexOf('hotreload=false') === -1;
}
if (true) {
  // If this bundle is inlined, use the resource query to get the correct url.
  urlParts = url.parse(__resourceQuery.substr(1));
} else {
  // Else, get the url from the <script> this file was called with.
  var scriptHost = getCurrentScriptSource();
  // eslint-disable-next-line no-useless-escape
  scriptHost = scriptHost.replace(/\/[^\/]+$/, '');
  urlParts = url.parse(scriptHost || '/', false, true);
}

if (!urlParts.port || urlParts.port === '0') {
  urlParts.port = self.location.port;
}

var _hot = false;
var initial = true;
var currentHash = '';
var useWarningOverlay = false;
var useErrorOverlay = false;
var useProgress = false;

var INFO = 'info';
var WARNING = 'warning';
var ERROR = 'error';
var NONE = 'none';

// Set the default log level
log.setDefaultLevel(INFO);

// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
  if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: 'webpack' + type,
      data: data
    }, '*');
  }
}

var onSocketMsg = {
  hot: function hot() {
    _hot = true;
    log.info('[WDS] Hot Module Replacement enabled.');
  },
  invalid: function invalid() {
    log.info('[WDS] App updated. Recompiling...');
    // fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    sendMsg('Invalid');
  },
  hash: function hash(_hash) {
    currentHash = _hash;
  },

  'still-ok': function stillOk() {
    log.info('[WDS] Nothing changed.');
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    sendMsg('StillOk');
  },
  'log-level': function logLevel(level) {
    var hotCtx = __webpack_require__(66);
    if (hotCtx.keys().indexOf('./log') !== -1) {
      hotCtx('./log').setLogLevel(level);
    }
    switch (level) {
      case INFO:
      case ERROR:
        log.setLevel(level);
        break;
      case WARNING:
        // loglevel's warning name is different from webpack's
        log.setLevel('warn');
        break;
      case NONE:
        log.disableAll();
        break;
      default:
        log.error('[WDS] Unknown clientLogLevel \'' + level + '\'');
    }
  },
  overlay: function overlay(value) {
    if (typeof document !== 'undefined') {
      if (typeof value === 'boolean') {
        useWarningOverlay = false;
        useErrorOverlay = value;
      } else if (value) {
        useWarningOverlay = value.warnings;
        useErrorOverlay = value.errors;
      }
    }
  },
  progress: function progress(_progress) {
    if (typeof document !== 'undefined') {
      useProgress = _progress;
    }
  },

  'progress-update': function progressUpdate(data) {
    if (useProgress) log.info('[WDS] ' + data.percent + '% - ' + data.msg + '.');
  },
  ok: function ok() {
    sendMsg('Ok');
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    if (initial) return initial = false; // eslint-disable-line no-return-assign
    reloadApp();
  },

  'content-changed': function contentChanged() {
    log.info('[WDS] Content base changed. Reloading...');
    self.location.reload();
  },
  warnings: function warnings(_warnings) {
    log.warn('[WDS] Warnings while compiling.');
    var strippedWarnings = _warnings.map(function (warning) {
      return stripAnsi(warning);
    });
    sendMsg('Warnings', strippedWarnings);
    for (var i = 0; i < strippedWarnings.length; i++) {
      log.warn(strippedWarnings[i]);
    }
    if (useWarningOverlay) overlay.showMessage(_warnings);

    if (initial) return initial = false; // eslint-disable-line no-return-assign
    reloadApp();
  },
  errors: function errors(_errors) {
    log.error('[WDS] Errors while compiling. Reload prevented.');
    var strippedErrors = _errors.map(function (error) {
      return stripAnsi(error);
    });
    sendMsg('Errors', strippedErrors);
    for (var i = 0; i < strippedErrors.length; i++) {
      log.error(strippedErrors[i]);
    }
    if (useErrorOverlay) overlay.showMessage(_errors);
    initial = false;
  },
  error: function error(_error) {
    log.error(_error);
  },
  close: function close() {
    log.error('[WDS] Disconnected!');
    sendMsg('Close');
  }
};

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;

// check ipv4 and ipv6 `all hostname`
if (hostname === '0.0.0.0' || hostname === '::') {
  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  // eslint-disable-next-line no-bitwise
  if (self.location.hostname && !!~self.location.protocol.indexOf('http')) {
    hostname = self.location.hostname;
  }
}

// `hostname` can be empty when the script path is relative. In that case, specifying
// a protocol would result in an invalid URL.
// When https is used in the app, secure websockets are always necessary
// because the browser doesn't accept non-secure websockets.
if (hostname && (self.location.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
  protocol = self.location.protocol;
}

var socketUrl = url.format({
  protocol: protocol,
  auth: urlParts.auth,
  hostname: hostname,
  port: urlParts.port,
  pathname: urlParts.path == null || urlParts.path === '/' ? '/sockjs-node' : urlParts.path
});

socket(socketUrl, onSocketMsg);

var isUnloading = false;
self.addEventListener('beforeunload', function () {
  isUnloading = true;
});

function reloadApp() {
  if (isUnloading || !hotReload) {
    return;
  }
  if (_hot) {
    log.info('[WDS] App hot update...');
    // eslint-disable-next-line global-require
    var hotEmitter = __webpack_require__(39);
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined' && self.window) {
      // broadcast update to window
      self.postMessage('webpackHotUpdate' + currentHash, '*');
    }
  } else {
    var rootWindow = self;
    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== 'about:') {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }

  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    log.info('[WDS] App updated. Reloading...');
    rootWindow.location.reload();
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:8080/"))

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styl_main_styl__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styl_main_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__styl_main_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__js_game_js__ = __webpack_require__(52);





/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML;

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
};
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
};
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
};
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
};[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>';
});

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML(text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text;
  }

  // Cache opened sequence.
  var ansiCodes = [];
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq];
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) {
        // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop();
        return '</span>';
      }
      // Open tag.
      ansiCodes.push(seq);
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">';
    }

    var ct = _closeTags[seq];
    if (ct) {
      // Pop sequence
      ansiCodes.pop();
      return ct;
    }
    return '';
  });

  // Make sure tags are closed.
  var l = ansiCodes.length;l > 0 && (ret += Array(l + 1).join('</span>'));

  return ret;
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.');
  }

  var _finalColors = {};
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
    if (!hex) {
      _finalColors[key] = _defColors[key];
      continue;
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex];
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string';
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000');
      }
      var defHexColor = _defColors[key];
      if (!hex[0]) {
        hex[0] = defHexColor[0];
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]];
        hex.push(defHexColor[1]);
      }

      hex = hex.slice(0, 2);
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000');
    }
    _finalColors[key] = hex;
  }
  _setTags(_finalColors);
};

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors);
};

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {};

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () {
      return _openTags;
    }
  });
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () {
      return _closeTags;
    }
  });
} else {
  ansiHTML.tags.open = _openTags;
  ansiHTML.tags.close = _closeTags;
}

function _setTags(colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1];
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey;

  for (var code in _styles) {
    var color = _styles[code];
    var oriColor = colors[color] || '000';
    _openTags[code] = 'color:#' + oriColor;
    code = parseInt(code);
    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
  }
}

ansiHTML.reset();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	return (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g
	);
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url;
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    }

    return url;
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {

  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = type === 'error';

  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = this._events;
  if (events === undefined) return this;

  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }

    if (list.length === 1) events[type] = list[0];

    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;

  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined) return [];

  var evlistener = events[type];
  if (evlistener === undefined) return [];

  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(25),
  Html4Entities: __webpack_require__(24),
  Html5Entities: __webpack_require__(7),
  AllHtmlEntities: __webpack_require__(7)
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ? parseInt(entity.substr(2), 16) : parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function (str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function (str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function (str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function (str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function (s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.encode = function (str) {
    return new XmlEntities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ? parseInt(s.substr(3), 16) : parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.decode = function (str) {
    return new XmlEntities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.encodeNonUTF = function (str) {
    return new XmlEntities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.encodeNonASCII = function (str) {
    return new XmlEntities().encodeNonASCII(str);
};

module.exports = XmlEntities;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";

    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
})(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size

    var noop = function () {};
    var undefinedType = "undefined";
    var isIE = typeof window !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);

    var logMethods = ["trace", "debug", "info", "warn", "error"];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function () {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
        var self = this;
        var currentLevel;
        var storageKey = "loglevel";
        if (name) {
            storageKey += ":" + name;
        }

        function persistLevelIfPossible(levelNum) {
            var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

            if (typeof window === undefinedType) return;

            // Use localStorage if available
            try {
                window.localStorage[storageKey] = levelName;
                return;
            } catch (ignore) {}

            // Use session cookie as fallback
            try {
                window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
            } catch (ignore) {}
        }

        function getPersistedLevel() {
            var storedLevel;

            if (typeof window === undefinedType) return;

            try {
                storedLevel = window.localStorage[storageKey];
            } catch (ignore) {}

            // Fallback to cookies if local storage gives us nothing
            if (typeof storedLevel === undefinedType) {
                try {
                    var cookie = window.document.cookie;
                    var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
                    if (location !== -1) {
                        storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                    }
                } catch (ignore) {}
            }

            // If the stored level is not valid, treat it as if nothing was stored.
            if (self.levels[storedLevel] === undefined) {
                storedLevel = undefined;
            }

            return storedLevel;
        }

        /*
         *
         * Public logger API - see https://github.com/pimterry/loglevel for details
         *
         */

        self.name = name;

        self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
            "ERROR": 4, "SILENT": 5 };

        self.methodFactory = factory || defaultMethodFactory;

        self.getLevel = function () {
            return currentLevel;
        };

        self.setLevel = function (level, persist) {
            if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
                level = self.levels[level.toUpperCase()];
            }
            if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
                currentLevel = level;
                if (persist !== false) {
                    // defaults to true
                    persistLevelIfPossible(level);
                }
                replaceLoggingMethods.call(self, level, name);
                if (typeof console === undefinedType && level < self.levels.SILENT) {
                    return "No console available for logging";
                }
            } else {
                throw "log.setLevel() called with invalid level: " + level;
            }
        };

        self.setDefaultLevel = function (level) {
            if (!getPersistedLevel()) {
                self.setLevel(level, false);
            }
        };

        self.enableAll = function (persist) {
            self.setLevel(self.levels.TRACE, persist);
        };

        self.disableAll = function (persist) {
            self.setLevel(self.levels.SILENT, persist);
        };

        // Initialize with the right level
        var initialLevel = getPersistedLevel();
        if (initialLevel == null) {
            initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
        }
        self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
            throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
            logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = typeof window !== undefinedType ? window.log : undefined;
    defaultLogger.noConflict = function () {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function (root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module && !module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
		root = freeGlobal;
	}

	/**
  * The `punycode` object.
  * @name punycode
  * @type Object
  */
	var punycode,


	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647,
	    // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	    tMin = 1,
	    tMax = 26,
	    skew = 38,
	    damp = 700,
	    initialBias = 72,
	    initialN = 128,
	    // 0x80
	delimiter = '-',
	    // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	    regexNonASCII = /[^\x20-\x7E]/,
	    // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
	    // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},


	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	    floor = Math.floor,
	    stringFromCharCode = String.fromCharCode,


	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
  * A generic error utility function.
  * @private
  * @param {String} type The error type.
  * @returns {Error} Throws a `RangeError` with the applicable error message.
  */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
  * A generic `Array#map` utility function.
  * @private
  * @param {Array} array The array to iterate over.
  * @param {Function} callback The function that gets called for every array
  * item.
  * @returns {Array} A new array of values returned by the callback function.
  */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
  * A simple `Array#map`-like wrapper to work with domain name strings or email
  * addresses.
  * @private
  * @param {String} domain The domain name or email address.
  * @param {Function} callback The function that gets called for every
  * character.
  * @returns {Array} A new string of characters returned by the callback
  * function.
  */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
  * Creates a string based on an array of numeric code points.
  * @see `punycode.ucs2.decode`
  * @memberOf punycode.ucs2
  * @name encode
  * @param {Array} codePoints The array of numeric code points.
  * @returns {String} The new Unicode string (UCS-2).
  */
	function ucs2encode(array) {
		return map(array, function (value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
  * Converts a basic code point into a digit/integer.
  * @see `digitToBasic()`
  * @private
  * @param {Number} codePoint The basic numeric code point value.
  * @returns {Number} The numeric value of a basic code point (for use in
  * representing integers) in the range `0` to `base - 1`, or `base` if
  * the code point does not represent a value.
  */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
  * Converts a digit/integer into a basic code point.
  * @see `basicToDigit()`
  * @private
  * @param {Number} digit The numeric value of a basic code point.
  * @returns {Number} The basic code point whose value (when used for
  * representing integers) is `digit`, which needs to be in the range
  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  * used; else, the lowercase form is used. The behavior is undefined
  * if `flag` is non-zero and `digit` has no uppercase form.
  */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
  * Bias adaptation function as per section 3.4 of RFC 3492.
  * https://tools.ietf.org/html/rfc3492#section-3.4
  * @private
  */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  * symbols.
  * @memberOf punycode
  * @param {String} input The Punycode string of ASCII-only symbols.
  * @returns {String} The resulting string of Unicode symbols.
  */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,

		/** Cached calculation results */
		baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;
			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
		}

		return ucs2encode(output);
	}

	/**
  * Converts a string of Unicode symbols (e.g. a domain name label) to a
  * Punycode string of ASCII-only symbols.
  * @memberOf punycode
  * @param {String} input The string of Unicode symbols.
  * @returns {String} The resulting Punycode string of ASCII-only symbols.
  */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],

		/** `inputLength` will hold the number of code points in `input`. */
		inputLength,

		/** Cached calculation results */
		handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base;; /* no condition */k += base) {
						t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;
		}
		return output.join('');
	}

	/**
  * Converts a Punycode string representing a domain name or an email address
  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  * it doesn't matter if you call it on a string that has already been
  * converted to Unicode.
  * @memberOf punycode
  * @param {String} input The Punycoded domain name or email address to
  * convert to Unicode.
  * @returns {String} The Unicode representation of the given Punycode
  * string.
  */
	function toUnicode(input) {
		return mapDomain(input, function (string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	}

	/**
  * Converts a Unicode string representing a domain name or an email address to
  * Punycode. Only the non-ASCII parts of the domain name will be converted,
  * i.e. it doesn't matter if you call it with a domain that's already in
  * ASCII.
  * @memberOf punycode
  * @param {String} input The domain name or email address to convert, as a
  * Unicode string.
  * @returns {String} The Punycode representation of the given domain name or
  * email address.
  */
	function toASCII(input) {
		return mapDomain(input, function (string) {
			return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
		'version': '1.4.1',
		/**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}
})(this);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38)(module), __webpack_require__(8)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function (v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(28);
exports.encode = exports.stringify = __webpack_require__(29);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var require;var require;/* sockjs-client v1.1.5 | http://sockjs.org | MIT license */
(function (f) {
  if (true) {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.SockJS = f();
  }
})(function () {
  var define, module, exports;return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;if (!f && c) return require(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
          }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];return o(n || r);
          }, p, p.exports, r, e, n, t);
        }return n[i].exports;
      }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);return o;
    }return r;
  }()({ 1: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var transportList = require('./transport-list');

        module.exports = require('./main')(transportList);

        // TODO can't get rid of this until all servers do
        if ('_sockjs_onload' in global) {
          setTimeout(global._sockjs_onload, 1);
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./main": 14, "./transport-list": 16 }], 2: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          Event = require('./event');

      function CloseEvent() {
        Event.call(this);
        this.initEvent('close', false, false);
        this.wasClean = false;
        this.code = 0;
        this.reason = '';
      }

      inherits(CloseEvent, Event);

      module.exports = CloseEvent;
    }, { "./event": 4, "inherits": 56 }], 3: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          EventTarget = require('./eventtarget');

      function EventEmitter() {
        EventTarget.call(this);
      }

      inherits(EventEmitter, EventTarget);

      EventEmitter.prototype.removeAllListeners = function (type) {
        if (type) {
          delete this._listeners[type];
        } else {
          this._listeners = {};
        }
      };

      EventEmitter.prototype.once = function (type, listener) {
        var self = this,
            fired = false;

        function g() {
          self.removeListener(type, g);

          if (!fired) {
            fired = true;
            listener.apply(this, arguments);
          }
        }

        this.on(type, g);
      };

      EventEmitter.prototype.emit = function () {
        var type = arguments[0];
        var listeners = this._listeners[type];
        if (!listeners) {
          return;
        }
        // equivalent of Array.prototype.slice.call(arguments, 1);
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var ai = 1; ai < l; ai++) {
          args[ai - 1] = arguments[ai];
        }
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, args);
        }
      };

      EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
      EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

      module.exports.EventEmitter = EventEmitter;
    }, { "./eventtarget": 5, "inherits": 56 }], 4: [function (require, module, exports) {
      'use strict';

      function Event(eventType) {
        this.type = eventType;
      }

      Event.prototype.initEvent = function (eventType, canBubble, cancelable) {
        this.type = eventType;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.timeStamp = +new Date();
        return this;
      };

      Event.prototype.stopPropagation = function () {};
      Event.prototype.preventDefault = function () {};

      Event.CAPTURING_PHASE = 1;
      Event.AT_TARGET = 2;
      Event.BUBBLING_PHASE = 3;

      module.exports = Event;
    }, {}], 5: [function (require, module, exports) {
      'use strict';

      /* Simplified implementation of DOM2 EventTarget.
       *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
       */

      function EventTarget() {
        this._listeners = {};
      }

      EventTarget.prototype.addEventListener = function (eventType, listener) {
        if (!(eventType in this._listeners)) {
          this._listeners[eventType] = [];
        }
        var arr = this._listeners[eventType];
        // #4
        if (arr.indexOf(listener) === -1) {
          // Make a copy so as not to interfere with a current dispatchEvent.
          arr = arr.concat([listener]);
        }
        this._listeners[eventType] = arr;
      };

      EventTarget.prototype.removeEventListener = function (eventType, listener) {
        var arr = this._listeners[eventType];
        if (!arr) {
          return;
        }
        var idx = arr.indexOf(listener);
        if (idx !== -1) {
          if (arr.length > 1) {
            // Make a copy so as not to interfere with a current dispatchEvent.
            this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
          } else {
            delete this._listeners[eventType];
          }
          return;
        }
      };

      EventTarget.prototype.dispatchEvent = function () {
        var event = arguments[0];
        var t = event.type;
        // equivalent of Array.prototype.slice.call(arguments, 0);
        var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
        // TODO: This doesn't match the real behavior; per spec, onfoo get
        // their place in line from the /first/ time they're set from
        // non-null. Although WebKit bumps it to the end every time it's
        // set.
        if (this['on' + t]) {
          this['on' + t].apply(this, args);
        }
        if (t in this._listeners) {
          // Grab a reference to the listeners list. removeEventListener may alter the list.
          var listeners = this._listeners[t];
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
          }
        }
      };

      module.exports = EventTarget;
    }, {}], 6: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          Event = require('./event');

      function TransportMessageEvent(data) {
        Event.call(this);
        this.initEvent('message', false, false);
        this.data = data;
      }

      inherits(TransportMessageEvent, Event);

      module.exports = TransportMessageEvent;
    }, { "./event": 4, "inherits": 56 }], 7: [function (require, module, exports) {
      'use strict';

      var JSON3 = require('json3'),
          iframeUtils = require('./utils/iframe');

      function FacadeJS(transport) {
        this._transport = transport;
        transport.on('message', this._transportMessage.bind(this));
        transport.on('close', this._transportClose.bind(this));
      }

      FacadeJS.prototype._transportClose = function (code, reason) {
        iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
      };
      FacadeJS.prototype._transportMessage = function (frame) {
        iframeUtils.postMessage('t', frame);
      };
      FacadeJS.prototype._send = function (data) {
        this._transport.send(data);
      };
      FacadeJS.prototype._close = function () {
        this._transport.close();
        this._transport.removeAllListeners();
      };

      module.exports = FacadeJS;
    }, { "./utils/iframe": 47, "json3": 57 }], 8: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            JSON3 = require('json3'),
            FacadeJS = require('./facade'),
            InfoIframeReceiver = require('./info-iframe-receiver'),
            iframeUtils = require('./utils/iframe'),
            loc = require('./location');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:iframe-bootstrap');
        }

        module.exports = function (SockJS, availableTransports) {
          var transportMap = {};
          availableTransports.forEach(function (at) {
            if (at.facadeTransport) {
              transportMap[at.facadeTransport.transportName] = at.facadeTransport;
            }
          });

          // hard-coded for the info iframe
          // TODO see if we can make this more dynamic
          transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
          var parentOrigin;

          /* eslint-disable camelcase */
          SockJS.bootstrap_iframe = function () {
            /* eslint-enable camelcase */
            var facade;
            iframeUtils.currentWindowId = loc.hash.slice(1);
            var onMessage = function (e) {
              if (e.source !== parent) {
                return;
              }
              if (typeof parentOrigin === 'undefined') {
                parentOrigin = e.origin;
              }
              if (e.origin !== parentOrigin) {
                return;
              }

              var iframeMessage;
              try {
                iframeMessage = JSON3.parse(e.data);
              } catch (ignored) {
                debug('bad json', e.data);
                return;
              }

              if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
                return;
              }
              switch (iframeMessage.type) {
                case 's':
                  var p;
                  try {
                    p = JSON3.parse(iframeMessage.data);
                  } catch (ignored) {
                    debug('bad json', iframeMessage.data);
                    break;
                  }
                  var version = p[0];
                  var transport = p[1];
                  var transUrl = p[2];
                  var baseUrl = p[3];
                  debug(version, transport, transUrl, baseUrl);
                  // change this to semver logic
                  if (version !== SockJS.version) {
                    throw new Error('Incompatible SockJS! Main site uses:' + ' "' + version + '", the iframe:' + ' "' + SockJS.version + '".');
                  }

                  if (!urlUtils.isOriginEqual(transUrl, loc.href) || !urlUtils.isOriginEqual(baseUrl, loc.href)) {
                    throw new Error('Can\'t connect to different domain from within an ' + 'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
                  }
                  facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
                  break;
                case 'm':
                  facade._send(iframeMessage.data);
                  break;
                case 'c':
                  if (facade) {
                    facade._close();
                  }
                  facade = null;
                  break;
              }
            };

            eventUtils.attachEvent('message', onMessage);

            // Start
            iframeUtils.postMessage('s');
          };
        };
      }).call(this, { env: {} });
    }, { "./facade": 7, "./info-iframe-receiver": 10, "./location": 13, "./utils/event": 46, "./utils/iframe": 47, "./utils/url": 52, "debug": 54, "json3": 57 }], 9: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            JSON3 = require('json3'),
            objectUtils = require('./utils/object');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:info-ajax');
        }

        function InfoAjax(url, AjaxObject) {
          EventEmitter.call(this);

          var self = this;
          var t0 = +new Date();
          this.xo = new AjaxObject('GET', url);

          this.xo.once('finish', function (status, text) {
            var info, rtt;
            if (status === 200) {
              rtt = +new Date() - t0;
              if (text) {
                try {
                  info = JSON3.parse(text);
                } catch (e) {
                  debug('bad json', text);
                }
              }

              if (!objectUtils.isObject(info)) {
                info = {};
              }
            }
            self.emit('finish', info, rtt);
            self.removeAllListeners();
          });
        }

        inherits(InfoAjax, EventEmitter);

        InfoAjax.prototype.close = function () {
          this.removeAllListeners();
          this.xo.close();
        };

        module.exports = InfoAjax;
      }).call(this, { env: {} });
    }, { "./utils/object": 49, "debug": 54, "events": 3, "inherits": 56, "json3": 57 }], 10: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          EventEmitter = require('events').EventEmitter,
          JSON3 = require('json3'),
          XHRLocalObject = require('./transport/sender/xhr-local'),
          InfoAjax = require('./info-ajax');

      function InfoReceiverIframe(transUrl) {
        var self = this;
        EventEmitter.call(this);

        this.ir = new InfoAjax(transUrl, XHRLocalObject);
        this.ir.once('finish', function (info, rtt) {
          self.ir = null;
          self.emit('message', JSON3.stringify([info, rtt]));
        });
      }

      inherits(InfoReceiverIframe, EventEmitter);

      InfoReceiverIframe.transportName = 'iframe-info-receiver';

      InfoReceiverIframe.prototype.close = function () {
        if (this.ir) {
          this.ir.close();
          this.ir = null;
        }
        this.removeAllListeners();
      };

      module.exports = InfoReceiverIframe;
    }, { "./info-ajax": 9, "./transport/sender/xhr-local": 37, "events": 3, "inherits": 56, "json3": 57 }], 11: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            JSON3 = require('json3'),
            utils = require('./utils/event'),
            IframeTransport = require('./transport/iframe'),
            InfoReceiverIframe = require('./info-iframe-receiver');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:info-iframe');
        }

        function InfoIframe(baseUrl, url) {
          var self = this;
          EventEmitter.call(this);

          var go = function () {
            var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

            ifr.once('message', function (msg) {
              if (msg) {
                var d;
                try {
                  d = JSON3.parse(msg);
                } catch (e) {
                  debug('bad json', msg);
                  self.emit('finish');
                  self.close();
                  return;
                }

                var info = d[0],
                    rtt = d[1];
                self.emit('finish', info, rtt);
              }
              self.close();
            });

            ifr.once('close', function () {
              self.emit('finish');
              self.close();
            });
          };

          // TODO this seems the same as the 'needBody' from transports
          if (!global.document.body) {
            utils.attachEvent('load', go);
          } else {
            go();
          }
        }

        inherits(InfoIframe, EventEmitter);

        InfoIframe.enabled = function () {
          return IframeTransport.enabled();
        };

        InfoIframe.prototype.close = function () {
          if (this.ifr) {
            this.ifr.close();
          }
          this.removeAllListeners();
          this.ifr = null;
        };

        module.exports = InfoIframe;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./info-iframe-receiver": 10, "./transport/iframe": 22, "./utils/event": 46, "debug": 54, "events": 3, "inherits": 56, "json3": 57 }], 12: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            urlUtils = require('./utils/url'),
            XDR = require('./transport/sender/xdr'),
            XHRCors = require('./transport/sender/xhr-cors'),
            XHRLocal = require('./transport/sender/xhr-local'),
            XHRFake = require('./transport/sender/xhr-fake'),
            InfoIframe = require('./info-iframe'),
            InfoAjax = require('./info-ajax');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:info-receiver');
        }

        function InfoReceiver(baseUrl, urlInfo) {
          debug(baseUrl);
          var self = this;
          EventEmitter.call(this);

          setTimeout(function () {
            self.doXhr(baseUrl, urlInfo);
          }, 0);
        }

        inherits(InfoReceiver, EventEmitter);

        // TODO this is currently ignoring the list of available transports and the whitelist

        InfoReceiver._getReceiver = function (baseUrl, url, urlInfo) {
          // determine method of CORS support (if needed)
          if (urlInfo.sameOrigin) {
            return new InfoAjax(url, XHRLocal);
          }
          if (XHRCors.enabled) {
            return new InfoAjax(url, XHRCors);
          }
          if (XDR.enabled && urlInfo.sameScheme) {
            return new InfoAjax(url, XDR);
          }
          if (InfoIframe.enabled()) {
            return new InfoIframe(baseUrl, url);
          }
          return new InfoAjax(url, XHRFake);
        };

        InfoReceiver.prototype.doXhr = function (baseUrl, urlInfo) {
          var self = this,
              url = urlUtils.addPath(baseUrl, '/info');
          debug('doXhr', url);

          this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

          this.timeoutRef = setTimeout(function () {
            debug('timeout');
            self._cleanup(false);
            self.emit('finish');
          }, InfoReceiver.timeout);

          this.xo.once('finish', function (info, rtt) {
            debug('finish', info, rtt);
            self._cleanup(true);
            self.emit('finish', info, rtt);
          });
        };

        InfoReceiver.prototype._cleanup = function (wasClean) {
          debug('_cleanup');
          clearTimeout(this.timeoutRef);
          this.timeoutRef = null;
          if (!wasClean && this.xo) {
            this.xo.close();
          }
          this.xo = null;
        };

        InfoReceiver.prototype.close = function () {
          debug('close');
          this.removeAllListeners();
          this._cleanup(false);
        };

        InfoReceiver.timeout = 8000;

        module.exports = InfoReceiver;
      }).call(this, { env: {} });
    }, { "./info-ajax": 9, "./info-iframe": 11, "./transport/sender/xdr": 34, "./transport/sender/xhr-cors": 35, "./transport/sender/xhr-fake": 36, "./transport/sender/xhr-local": 37, "./utils/url": 52, "debug": 54, "events": 3, "inherits": 56 }], 13: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = global.location || {
          origin: 'http://localhost:80',
          protocol: 'http:',
          host: 'localhost',
          port: 80,
          href: 'http://localhost/',
          hash: ''
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 14: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        require('./shims');

        var URL = require('url-parse'),
            inherits = require('inherits'),
            JSON3 = require('json3'),
            random = require('./utils/random'),
            escape = require('./utils/escape'),
            urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            transport = require('./utils/transport'),
            objectUtils = require('./utils/object'),
            browser = require('./utils/browser'),
            log = require('./utils/log'),
            Event = require('./event/event'),
            EventTarget = require('./event/eventtarget'),
            loc = require('./location'),
            CloseEvent = require('./event/close'),
            TransportMessageEvent = require('./event/trans-message'),
            InfoReceiver = require('./info-receiver');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:main');
        }

        var transports;

        // follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
        function SockJS(url, protocols, options) {
          if (!(this instanceof SockJS)) {
            return new SockJS(url, protocols, options);
          }
          if (arguments.length < 1) {
            throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
          }
          EventTarget.call(this);

          this.readyState = SockJS.CONNECTING;
          this.extensions = '';
          this.protocol = '';

          // non-standard extension
          options = options || {};
          if (options.protocols_whitelist) {
            log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
          }
          this._transportsWhitelist = options.transports;
          this._transportOptions = options.transportOptions || {};

          var sessionId = options.sessionId || 8;
          if (typeof sessionId === 'function') {
            this._generateSessionId = sessionId;
          } else if (typeof sessionId === 'number') {
            this._generateSessionId = function () {
              return random.string(sessionId);
            };
          } else {
            throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
          }

          this._server = options.server || random.numberString(1000);

          // Step 1 of WS spec - parse and validate the url. Issue #8
          var parsedUrl = new URL(url);
          if (!parsedUrl.host || !parsedUrl.protocol) {
            throw new SyntaxError("The URL '" + url + "' is invalid");
          } else if (parsedUrl.hash) {
            throw new SyntaxError('The URL must not contain a fragment');
          } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
          }

          var secure = parsedUrl.protocol === 'https:';
          // Step 2 - don't allow secure origin with an insecure protocol
          if (loc.protocol === 'https:' && !secure) {
            throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
          }

          // Step 3 - check port access - no need here
          // Step 4 - parse protocols argument
          if (!protocols) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            protocols = [protocols];
          }

          // Step 5 - check protocols argument
          var sortedProtocols = protocols.sort();
          sortedProtocols.forEach(function (proto, i) {
            if (!proto) {
              throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
            }
            if (i < sortedProtocols.length - 1 && proto === sortedProtocols[i + 1]) {
              throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
            }
          });

          // Step 6 - convert origin
          var o = urlUtils.getOrigin(loc.href);
          this._origin = o ? o.toLowerCase() : null;

          // remove the trailing slash
          parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

          // store the sanitized url
          this.url = parsedUrl.href;
          debug('using url', this.url);

          // Step 7 - start connection in background
          // obtain server info
          // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
          this._urlInfo = {
            nullOrigin: !browser.hasDomain(),
            sameOrigin: urlUtils.isOriginEqual(this.url, loc.href),
            sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
          };

          this._ir = new InfoReceiver(this.url, this._urlInfo);
          this._ir.once('finish', this._receiveInfo.bind(this));
        }

        inherits(SockJS, EventTarget);

        function userSetCode(code) {
          return code === 1000 || code >= 3000 && code <= 4999;
        }

        SockJS.prototype.close = function (code, reason) {
          // Step 1
          if (code && !userSetCode(code)) {
            throw new Error('InvalidAccessError: Invalid code');
          }
          // Step 2.4 states the max is 123 bytes, but we are just checking length
          if (reason && reason.length > 123) {
            throw new SyntaxError('reason argument has an invalid length');
          }

          // Step 3.1
          if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
            return;
          }

          // TODO look at docs to determine how to set this
          var wasClean = true;
          this._close(code || 1000, reason || 'Normal closure', wasClean);
        };

        SockJS.prototype.send = function (data) {
          // #13 - convert anything non-string to string
          // TODO this currently turns objects into [object Object]
          if (typeof data !== 'string') {
            data = '' + data;
          }
          if (this.readyState === SockJS.CONNECTING) {
            throw new Error('InvalidStateError: The connection has not been established yet');
          }
          if (this.readyState !== SockJS.OPEN) {
            return;
          }
          this._transport.send(escape.quote(data));
        };

        SockJS.version = require('./version');

        SockJS.CONNECTING = 0;
        SockJS.OPEN = 1;
        SockJS.CLOSING = 2;
        SockJS.CLOSED = 3;

        SockJS.prototype._receiveInfo = function (info, rtt) {
          debug('_receiveInfo', rtt);
          this._ir = null;
          if (!info) {
            this._close(1002, 'Cannot connect to server');
            return;
          }

          // establish a round-trip timeout (RTO) based on the
          // round-trip time (RTT)
          this._rto = this.countRTO(rtt);
          // allow server to override url used for the actual transport
          this._transUrl = info.base_url ? info.base_url : this.url;
          info = objectUtils.extend(info, this._urlInfo);
          debug('info', info);
          // determine list of desired and supported transports
          var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
          this._transports = enabledTransports.main;
          debug(this._transports.length + ' enabled transports');

          this._connect();
        };

        SockJS.prototype._connect = function () {
          for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
            debug('attempt', Transport.transportName);
            if (Transport.needBody) {
              if (!global.document.body || typeof global.document.readyState !== 'undefined' && global.document.readyState !== 'complete' && global.document.readyState !== 'interactive') {
                debug('waiting for body');
                this._transports.unshift(Transport);
                eventUtils.attachEvent('load', this._connect.bind(this));
                return;
              }
            }

            // calculate timeout based on RTO and round trips. Default to 5s
            var timeoutMs = this._rto * Transport.roundTrips || 5000;
            this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
            debug('using timeout', timeoutMs);

            var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
            var options = this._transportOptions[Transport.transportName];
            debug('transport url', transportUrl);
            var transportObj = new Transport(transportUrl, this._transUrl, options);
            transportObj.on('message', this._transportMessage.bind(this));
            transportObj.once('close', this._transportClose.bind(this));
            transportObj.transportName = Transport.transportName;
            this._transport = transportObj;

            return;
          }
          this._close(2000, 'All transports failed', false);
        };

        SockJS.prototype._transportTimeout = function () {
          debug('_transportTimeout');
          if (this.readyState === SockJS.CONNECTING) {
            if (this._transport) {
              this._transport.close();
            }

            this._transportClose(2007, 'Transport timed out');
          }
        };

        SockJS.prototype._transportMessage = function (msg) {
          debug('_transportMessage', msg);
          var self = this,
              type = msg.slice(0, 1),
              content = msg.slice(1),
              payload;

          // first check for messages that don't need a payload
          switch (type) {
            case 'o':
              this._open();
              return;
            case 'h':
              this.dispatchEvent(new Event('heartbeat'));
              debug('heartbeat', this.transport);
              return;
          }

          if (content) {
            try {
              payload = JSON3.parse(content);
            } catch (e) {
              debug('bad json', content);
            }
          }

          if (typeof payload === 'undefined') {
            debug('empty payload', content);
            return;
          }

          switch (type) {
            case 'a':
              if (Array.isArray(payload)) {
                payload.forEach(function (p) {
                  debug('message', self.transport, p);
                  self.dispatchEvent(new TransportMessageEvent(p));
                });
              }
              break;
            case 'm':
              debug('message', this.transport, payload);
              this.dispatchEvent(new TransportMessageEvent(payload));
              break;
            case 'c':
              if (Array.isArray(payload) && payload.length === 2) {
                this._close(payload[0], payload[1], true);
              }
              break;
          }
        };

        SockJS.prototype._transportClose = function (code, reason) {
          debug('_transportClose', this.transport, code, reason);
          if (this._transport) {
            this._transport.removeAllListeners();
            this._transport = null;
            this.transport = null;
          }

          if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
            this._connect();
            return;
          }

          this._close(code, reason);
        };

        SockJS.prototype._open = function () {
          debug('_open', this._transport.transportName, this.readyState);
          if (this.readyState === SockJS.CONNECTING) {
            if (this._transportTimeoutId) {
              clearTimeout(this._transportTimeoutId);
              this._transportTimeoutId = null;
            }
            this.readyState = SockJS.OPEN;
            this.transport = this._transport.transportName;
            this.dispatchEvent(new Event('open'));
            debug('connected', this.transport);
          } else {
            // The server might have been restarted, and lost track of our
            // connection.
            this._close(1006, 'Server lost session');
          }
        };

        SockJS.prototype._close = function (code, reason, wasClean) {
          debug('_close', this.transport, code, reason, wasClean, this.readyState);
          var forceFail = false;

          if (this._ir) {
            forceFail = true;
            this._ir.close();
            this._ir = null;
          }
          if (this._transport) {
            this._transport.close();
            this._transport = null;
            this.transport = null;
          }

          if (this.readyState === SockJS.CLOSED) {
            throw new Error('InvalidStateError: SockJS has already been closed');
          }

          this.readyState = SockJS.CLOSING;
          setTimeout(function () {
            this.readyState = SockJS.CLOSED;

            if (forceFail) {
              this.dispatchEvent(new Event('error'));
            }

            var e = new CloseEvent('close');
            e.wasClean = wasClean || false;
            e.code = code || 1000;
            e.reason = reason;

            this.dispatchEvent(e);
            this.onmessage = this.onclose = this.onerror = null;
            debug('disconnected');
          }.bind(this), 0);
        };

        // See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
        // and RFC 2988.
        SockJS.prototype.countRTO = function (rtt) {
          // In a local environment, when using IE8/9 and the `jsonp-polling`
          // transport the time needed to establish a connection (the time that pass
          // from the opening of the transport to the call of `_dispatchOpen`) is
          // around 200msec (the lower bound used in the article above) and this
          // causes spurious timeouts. For this reason we calculate a value slightly
          // larger than that used in the article.
          if (rtt > 100) {
            return 4 * rtt; // rto > 400msec
          }
          return 300 + rtt; // 300msec < rto <= 400msec
        };

        module.exports = function (availableTransports) {
          transports = transport(availableTransports);
          require('./iframe-bootstrap')(SockJS, availableTransports);
          return SockJS;
        };
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./event/close": 2, "./event/event": 4, "./event/eventtarget": 5, "./event/trans-message": 6, "./iframe-bootstrap": 8, "./info-receiver": 12, "./location": 13, "./shims": 15, "./utils/browser": 44, "./utils/escape": 45, "./utils/event": 46, "./utils/log": 48, "./utils/object": 49, "./utils/random": 50, "./utils/transport": 51, "./utils/url": 52, "./version": 53, "debug": 54, "inherits": 56, "json3": 57, "url-parse": 61 }], 15: [function (require, module, exports) {
      /* eslint-disable */
      /* jscs: disable */
      'use strict';

      // pulled specific shims from https://github.com/es-shims/es5-shim

      var ArrayPrototype = Array.prototype;
      var ObjectPrototype = Object.prototype;
      var FunctionPrototype = Function.prototype;
      var StringPrototype = String.prototype;
      var array_slice = ArrayPrototype.slice;

      var _toString = ObjectPrototype.toString;
      var isFunction = function (val) {
        return ObjectPrototype.toString.call(val) === '[object Function]';
      };
      var isArray = function isArray(obj) {
        return _toString.call(obj) === '[object Array]';
      };
      var isString = function isString(obj) {
        return _toString.call(obj) === '[object String]';
      };

      var supportsDescriptors = Object.defineProperty && function () {
        try {
          Object.defineProperty({}, 'x', {});
          return true;
        } catch (e) {
          /* this is ES3 */
          return false;
        }
      }();

      // Define configurable, writable and non-enumerable props
      // if they don't exist.
      var defineProperty;
      if (supportsDescriptors) {
        defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
          });
        };
      } else {
        defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          object[name] = method;
        };
      }
      var defineProperties = function (object, map, forceAssign) {
        for (var name in map) {
          if (ObjectPrototype.hasOwnProperty.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
        }
      };

      var toObject = function (o) {
        if (o == null) {
          // this matches both null and undefined
          throw new TypeError("can't convert " + o + ' to object');
        }
        return Object(o);
      };

      //
      // Util
      // ======
      //

      // ES5 9.4
      // http://es5.github.com/#x9.4
      // http://jsperf.com/to-integer

      function toInteger(num) {
        var n = +num;
        if (n !== n) {
          // isNaN
          n = 0;
        } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
      }

      function ToUint32(x) {
        return x >>> 0;
      }

      //
      // Function
      // ========
      //

      // ES-5 15.3.4.5
      // http://es5.github.com/#x15.3.4.5

      function Empty() {}

      defineProperties(FunctionPrototype, {
        bind: function bind(that) {
          // .length is 1
          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var binder = function () {

            if (this instanceof bound) {
              // 15.3.4.5.2 [[Construct]]
              // When the [[Construct]] internal method of a function object,
              // F that was created using the bind function is called with a
              // list of arguments ExtraArgs, the following steps are taken:
              // 1. Let target be the value of F's [[TargetFunction]]
              //   internal property.
              // 2. If target has no [[Construct]] internal method, a
              //   TypeError exception is thrown.
              // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Construct]] internal
              //   method of target providing args as the arguments.

              var result = target.apply(this, args.concat(array_slice.call(arguments)));
              if (Object(result) === result) {
                return result;
              }
              return this;
            } else {
              // 15.3.4.5.1 [[Call]]
              // When the [[Call]] internal method of a function object, F,
              // which was created using the bind function is called with a
              // this value and a list of arguments ExtraArgs, the following
              // steps are taken:
              // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 2. Let boundThis be the value of F's [[BoundThis]] internal
              //   property.
              // 3. Let target be the value of F's [[TargetFunction]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Call]] internal method
              //   of target providing boundThis as the this value and
              //   providing args as the arguments.

              // equiv: target.call(this, ...boundArgs, ...args)
              return target.apply(that, args.concat(array_slice.call(arguments)));
            }
          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = Math.max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

          if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
        }
      });

      //
      // Array
      // =====
      //

      // ES5 15.4.3.2
      // http://es5.github.com/#x15.4.3.2
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
      defineProperties(Array, { isArray: isArray });

      var boxedString = Object('a');
      var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

      var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        if (method) {
          method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') {
              properlyBoxesNonStrict = false;
            }
          });

          method.call([1], function () {
            'use strict';

            properlyBoxesStrict = typeof this === 'string';
          }, 'x');
        }
        return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
      };

      defineProperties(ArrayPrototype, {
        forEach: function forEach(fun /*, thisp*/) {
          var object = toObject(this),
              self = splitString && isString(this) ? this.split('') : object,
              thisp = arguments[1],
              i = -1,
              length = self.length >>> 0;

          // If no callback function or if callback is not a callable function
          if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
          }

          while (++i < length) {
            if (i in self) {
              // Invoke the callback function with call, passing arguments:
              // context, property value, property key, thisArg object
              // context
              fun.call(thisp, self[i], i, object);
            }
          }
        }
      }, !properlyBoxesContext(ArrayPrototype.forEach));

      // ES5 15.4.4.14
      // http://es5.github.com/#x15.4.4.14
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
      var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
      defineProperties(ArrayPrototype, {
        indexOf: function indexOf(sought /*, fromIndex */) {
          var self = splitString && isString(this) ? this.split('') : toObject(this),
              length = self.length >>> 0;

          if (!length) {
            return -1;
          }

          var i = 0;
          if (arguments.length > 1) {
            i = toInteger(arguments[1]);
          }

          // handle negative indices
          i = i >= 0 ? i : Math.max(0, length + i);
          for (; i < length; i++) {
            if (i in self && self[i] === sought) {
              return i;
            }
          }
          return -1;
        }
      }, hasFirefox2IndexOfBug);

      //
      // String
      // ======
      //

      // ES5 15.5.4.14
      // http://es5.github.com/#x15.5.4.14

      // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
      // Many browsers do not split properly with regular expressions or they
      // do not perform the split correctly under obscure conditions.
      // See http://blog.stevenlevithan.com/archives/cross-browser-split
      // I've tested in many browsers and this seems to cover the deviant ones:
      //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
      //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
      //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
      //       [undefined, "t", undefined, "e", ...]
      //    ''.split(/.?/) should be [], not [""]
      //    '.'.split(/()()/) should be ["."], not ["", "", "."]

      var string_split = StringPrototype.split;
      if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || 'test'.split(/(?:)/, -1).length !== 4 || ''.split(/.?/).length || '.'.split(/()()/).length > 1) {
        (function () {
          var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

          StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
              return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
              return string_split.call(this, separator, limit);
            }

            var output = [],
                flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + ( // Proposed for ES6
            separator.sticky ? 'y' : ''),
                // Firefox 3+
            lastLastIndex = 0,

            // Make `global` and avoid `lastIndex` issues by working with a copy
            separator2,
                match,
                lastIndex,
                lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
              // Doesn't need flags gy, but they don't hurt
              separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ? -1 >>> 0 : // Math.pow(2, 32) - 1
            ToUint32(limit);
            while (match = separator.exec(string)) {
              // `separator.lastIndex` is not reliable cross-browser
              lastIndex = match.index + match[0].length;
              if (lastIndex > lastLastIndex) {
                output.push(string.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                  match[0].replace(separator2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                      if (arguments[i] === void 0) {
                        match[i] = void 0;
                      }
                    }
                  });
                }
                if (match.length > 1 && match.index < string.length) {
                  ArrayPrototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                  break;
                }
              }
              if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
              }
            }
            if (lastLastIndex === string.length) {
              if (lastLength || !separator.test('')) {
                output.push('');
              }
            } else {
              output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
          };
        })();

        // [bugfix, chrome]
        // If separator is undefined, then the result array contains just one String,
        // which is the this value (converted to a String). If limit is not undefined,
        // then the output array is truncated so that it contains no more than limit
        // elements.
        // "0".split(undefined, 0) -> []
      } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
          if (separator === void 0 && limit === 0) {
            return [];
          }
          return string_split.call(this, separator, limit);
        };
      }

      // ECMA-262, 3rd B.2.3
      // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
      // non-normative section suggesting uniform semantics and it should be
      // normalized across all browsers
      // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
      var string_substr = StringPrototype.substr;
      var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
      defineProperties(StringPrototype, {
        substr: function substr(start, length) {
          return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
        }
      }, hasNegativeSubstrBug);
    }, {}], 16: [function (require, module, exports) {
      'use strict';

      module.exports = [
      // streaming transports
      require('./transport/websocket'), require('./transport/xhr-streaming'), require('./transport/xdr-streaming'), require('./transport/eventsource'), require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))

      // polling transports
      , require('./transport/htmlfile'), require('./transport/lib/iframe-wrap')(require('./transport/htmlfile')), require('./transport/xhr-polling'), require('./transport/xdr-polling'), require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling')), require('./transport/jsonp-polling')];
    }, { "./transport/eventsource": 20, "./transport/htmlfile": 21, "./transport/jsonp-polling": 23, "./transport/lib/iframe-wrap": 26, "./transport/websocket": 38, "./transport/xdr-polling": 39, "./transport/xdr-streaming": 40, "./transport/xhr-polling": 41, "./transport/xhr-streaming": 42 }], 17: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            utils = require('../../utils/event'),
            urlUtils = require('../../utils/url'),
            XHR = global.XMLHttpRequest;

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:browser:xhr');
        }

        function AbstractXHRObject(method, url, payload, opts) {
          debug(method, url);
          var self = this;
          EventEmitter.call(this);

          setTimeout(function () {
            self._start(method, url, payload, opts);
          }, 0);
        }

        inherits(AbstractXHRObject, EventEmitter);

        AbstractXHRObject.prototype._start = function (method, url, payload, opts) {
          var self = this;

          try {
            this.xhr = new XHR();
          } catch (x) {
            // intentionally empty
          }

          if (!this.xhr) {
            debug('no xhr');
            this.emit('finish', 0, 'no xhr support');
            this._cleanup();
            return;
          }

          // several browsers cache POSTs
          url = urlUtils.addQuery(url, 't=' + +new Date());

          // Explorer tends to keep connection open, even after the
          // tab gets closed: http://bugs.jquery.com/ticket/5280
          this.unloadRef = utils.unloadAdd(function () {
            debug('unload cleanup');
            self._cleanup(true);
          });
          try {
            this.xhr.open(method, url, true);
            if (this.timeout && 'timeout' in this.xhr) {
              this.xhr.timeout = this.timeout;
              this.xhr.ontimeout = function () {
                debug('xhr timeout');
                self.emit('finish', 0, '');
                self._cleanup(false);
              };
            }
          } catch (e) {
            debug('exception', e);
            // IE raises an exception on wrong port.
            this.emit('finish', 0, '');
            this._cleanup(false);
            return;
          }

          if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
            debug('withCredentials');
            // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
            // "This never affects same-site requests."

            this.xhr.withCredentials = true;
          }
          if (opts && opts.headers) {
            for (var key in opts.headers) {
              this.xhr.setRequestHeader(key, opts.headers[key]);
            }
          }

          this.xhr.onreadystatechange = function () {
            if (self.xhr) {
              var x = self.xhr;
              var text, status;
              debug('readyState', x.readyState);
              switch (x.readyState) {
                case 3:
                  // IE doesn't like peeking into responseText or status
                  // on Microsoft.XMLHTTP and readystate=3
                  try {
                    status = x.status;
                    text = x.responseText;
                  } catch (e) {
                    // intentionally empty
                  }
                  debug('status', status);
                  // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                  if (status === 1223) {
                    status = 204;
                  }

                  // IE does return readystate == 3 for 404 answers.
                  if (status === 200 && text && text.length > 0) {
                    debug('chunk');
                    self.emit('chunk', status, text);
                  }
                  break;
                case 4:
                  status = x.status;
                  debug('status', status);
                  // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                  if (status === 1223) {
                    status = 204;
                  }
                  // IE returns this for a bad port
                  // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
                  if (status === 12005 || status === 12029) {
                    status = 0;
                  }

                  debug('finish', status, x.responseText);
                  self.emit('finish', status, x.responseText);
                  self._cleanup(false);
                  break;
              }
            }
          };

          try {
            self.xhr.send(payload);
          } catch (e) {
            self.emit('finish', 0, '');
            self._cleanup(false);
          }
        };

        AbstractXHRObject.prototype._cleanup = function (abort) {
          debug('cleanup');
          if (!this.xhr) {
            return;
          }
          this.removeAllListeners();
          utils.unloadDel(this.unloadRef);

          // IE needs this field to be a function
          this.xhr.onreadystatechange = function () {};
          if (this.xhr.ontimeout) {
            this.xhr.ontimeout = null;
          }

          if (abort) {
            try {
              this.xhr.abort();
            } catch (x) {
              // intentionally empty
            }
          }
          this.unloadRef = this.xhr = null;
        };

        AbstractXHRObject.prototype.close = function () {
          debug('close');
          this._cleanup(true);
        };

        AbstractXHRObject.enabled = !!XHR;
        // override XMLHttpRequest for IE6/7
        // obfuscate to avoid firewalls
        var axo = ['Active'].concat('Object').join('X');
        if (!AbstractXHRObject.enabled && axo in global) {
          debug('overriding xmlhttprequest');
          XHR = function () {
            try {
              return new global[axo]('Microsoft.XMLHTTP');
            } catch (e) {
              return null;
            }
          };
          AbstractXHRObject.enabled = !!new XHR();
        }

        var cors = false;
        try {
          cors = 'withCredentials' in new XHR();
        } catch (ignored) {
          // intentionally empty
        }

        AbstractXHRObject.supportsCORS = cors;

        module.exports = AbstractXHRObject;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/event": 46, "../../utils/url": 52, "debug": 54, "events": 3, "inherits": 56 }], 18: [function (require, module, exports) {
      (function (global) {
        module.exports = global.EventSource;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 19: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var Driver = global.WebSocket || global.MozWebSocket;
        if (Driver) {
          module.exports = function WebSocketBrowserDriver(url) {
            return new Driver(url);
          };
        } else {
          module.exports = undefined;
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 20: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          EventSourceReceiver = require('./receiver/eventsource'),
          XHRCorsObject = require('./sender/xhr-cors'),
          EventSourceDriver = require('eventsource');

      function EventSourceTransport(transUrl) {
        if (!EventSourceTransport.enabled()) {
          throw new Error('Transport created when disabled');
        }

        AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
      }

      inherits(EventSourceTransport, AjaxBasedTransport);

      EventSourceTransport.enabled = function () {
        return !!EventSourceDriver;
      };

      EventSourceTransport.transportName = 'eventsource';
      EventSourceTransport.roundTrips = 2;

      module.exports = EventSourceTransport;
    }, { "./lib/ajax-based": 24, "./receiver/eventsource": 29, "./sender/xhr-cors": 35, "eventsource": 18, "inherits": 56 }], 21: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          HtmlfileReceiver = require('./receiver/htmlfile'),
          XHRLocalObject = require('./sender/xhr-local'),
          AjaxBasedTransport = require('./lib/ajax-based');

      function HtmlFileTransport(transUrl) {
        if (!HtmlfileReceiver.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
      }

      inherits(HtmlFileTransport, AjaxBasedTransport);

      HtmlFileTransport.enabled = function (info) {
        return HtmlfileReceiver.enabled && info.sameOrigin;
      };

      HtmlFileTransport.transportName = 'htmlfile';
      HtmlFileTransport.roundTrips = 2;

      module.exports = HtmlFileTransport;
    }, { "./lib/ajax-based": 24, "./receiver/htmlfile": 30, "./sender/xhr-local": 37, "inherits": 56 }], 22: [function (require, module, exports) {
      (function (process) {
        'use strict';

        // Few cool transports do work only for same-origin. In order to make
        // them work cross-domain we shall use iframe, served from the
        // remote domain. New browsers have capabilities to communicate with
        // cross domain iframe using postMessage(). In IE it was implemented
        // from IE 8+, but of course, IE got some details wrong:
        //    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
        //    http://stevesouders.com/misc/test-postmessage.php

        var inherits = require('inherits'),
            JSON3 = require('json3'),
            EventEmitter = require('events').EventEmitter,
            version = require('../version'),
            urlUtils = require('../utils/url'),
            iframeUtils = require('../utils/iframe'),
            eventUtils = require('../utils/event'),
            random = require('../utils/random');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:transport:iframe');
        }

        function IframeTransport(transport, transUrl, baseUrl) {
          if (!IframeTransport.enabled()) {
            throw new Error('Transport created when disabled');
          }
          EventEmitter.call(this);

          var self = this;
          this.origin = urlUtils.getOrigin(baseUrl);
          this.baseUrl = baseUrl;
          this.transUrl = transUrl;
          this.transport = transport;
          this.windowId = random.string(8);

          var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
          debug(transport, transUrl, iframeUrl);

          this.iframeObj = iframeUtils.createIframe(iframeUrl, function (r) {
            debug('err callback');
            self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
            self.close();
          });

          this.onmessageCallback = this._message.bind(this);
          eventUtils.attachEvent('message', this.onmessageCallback);
        }

        inherits(IframeTransport, EventEmitter);

        IframeTransport.prototype.close = function () {
          debug('close');
          this.removeAllListeners();
          if (this.iframeObj) {
            eventUtils.detachEvent('message', this.onmessageCallback);
            try {
              // When the iframe is not loaded, IE raises an exception
              // on 'contentWindow'.
              this.postMessage('c');
            } catch (x) {
              // intentionally empty
            }
            this.iframeObj.cleanup();
            this.iframeObj = null;
            this.onmessageCallback = this.iframeObj = null;
          }
        };

        IframeTransport.prototype._message = function (e) {
          debug('message', e.data);
          if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
            debug('not same origin', e.origin, this.origin);
            return;
          }

          var iframeMessage;
          try {
            iframeMessage = JSON3.parse(e.data);
          } catch (ignored) {
            debug('bad json', e.data);
            return;
          }

          if (iframeMessage.windowId !== this.windowId) {
            debug('mismatched window id', iframeMessage.windowId, this.windowId);
            return;
          }

          switch (iframeMessage.type) {
            case 's':
              this.iframeObj.loaded();
              // window global dependency
              this.postMessage('s', JSON3.stringify([version, this.transport, this.transUrl, this.baseUrl]));
              break;
            case 't':
              this.emit('message', iframeMessage.data);
              break;
            case 'c':
              var cdata;
              try {
                cdata = JSON3.parse(iframeMessage.data);
              } catch (ignored) {
                debug('bad json', iframeMessage.data);
                return;
              }
              this.emit('close', cdata[0], cdata[1]);
              this.close();
              break;
          }
        };

        IframeTransport.prototype.postMessage = function (type, data) {
          debug('postMessage', type, data);
          this.iframeObj.post(JSON3.stringify({
            windowId: this.windowId,
            type: type,
            data: data || ''
          }), this.origin);
        };

        IframeTransport.prototype.send = function (message) {
          debug('send', message);
          this.postMessage('m', message);
        };

        IframeTransport.enabled = function () {
          return iframeUtils.iframeEnabled;
        };

        IframeTransport.transportName = 'iframe';
        IframeTransport.roundTrips = 2;

        module.exports = IframeTransport;
      }).call(this, { env: {} });
    }, { "../utils/event": 46, "../utils/iframe": 47, "../utils/random": 50, "../utils/url": 52, "../version": 53, "debug": 54, "events": 3, "inherits": 56, "json3": 57 }], 23: [function (require, module, exports) {
      (function (global) {
        'use strict';

        // The simplest and most robust transport, using the well-know cross
        // domain hack - JSONP. This transport is quite inefficient - one
        // message could use up to one http request. But at least it works almost
        // everywhere.
        // Known limitations:
        //   o you will get a spinning cursor
        //   o for Konqueror a dumb timer is needed to detect errors

        var inherits = require('inherits'),
            SenderReceiver = require('./lib/sender-receiver'),
            JsonpReceiver = require('./receiver/jsonp'),
            jsonpSender = require('./sender/jsonp');

        function JsonPTransport(transUrl) {
          if (!JsonPTransport.enabled()) {
            throw new Error('Transport created when disabled');
          }
          SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
        }

        inherits(JsonPTransport, SenderReceiver);

        JsonPTransport.enabled = function () {
          return !!global.document;
        };

        JsonPTransport.transportName = 'jsonp-polling';
        JsonPTransport.roundTrips = 1;
        JsonPTransport.needBody = true;

        module.exports = JsonPTransport;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./lib/sender-receiver": 28, "./receiver/jsonp": 31, "./sender/jsonp": 33, "inherits": 56 }], 24: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            SenderReceiver = require('./sender-receiver');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:ajax-based');
        }

        function createAjaxSender(AjaxObject) {
          return function (url, payload, callback) {
            debug('create ajax sender', url, payload);
            var opt = {};
            if (typeof payload === 'string') {
              opt.headers = { 'Content-type': 'text/plain' };
            }
            var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
            var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
            xo.once('finish', function (status) {
              debug('finish', status);
              xo = null;

              if (status !== 200 && status !== 204) {
                return callback(new Error('http status ' + status));
              }
              callback();
            });
            return function () {
              debug('abort');
              xo.close();
              xo = null;

              var err = new Error('Aborted');
              err.code = 1000;
              callback(err);
            };
          };
        }

        function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
          SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
        }

        inherits(AjaxBasedTransport, SenderReceiver);

        module.exports = AjaxBasedTransport;
      }).call(this, { env: {} });
    }, { "../../utils/url": 52, "./sender-receiver": 28, "debug": 54, "inherits": 56 }], 25: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:buffered-sender');
        }

        function BufferedSender(url, sender) {
          debug(url);
          EventEmitter.call(this);
          this.sendBuffer = [];
          this.sender = sender;
          this.url = url;
        }

        inherits(BufferedSender, EventEmitter);

        BufferedSender.prototype.send = function (message) {
          debug('send', message);
          this.sendBuffer.push(message);
          if (!this.sendStop) {
            this.sendSchedule();
          }
        };

        // For polling transports in a situation when in the message callback,
        // new message is being send. If the sending connection was started
        // before receiving one, it is possible to saturate the network and
        // timeout due to the lack of receiving socket. To avoid that we delay
        // sending messages by some small time, in order to let receiving
        // connection be started beforehand. This is only a halfmeasure and
        // does not fix the big problem, but it does make the tests go more
        // stable on slow networks.
        BufferedSender.prototype.sendScheduleWait = function () {
          debug('sendScheduleWait');
          var self = this;
          var tref;
          this.sendStop = function () {
            debug('sendStop');
            self.sendStop = null;
            clearTimeout(tref);
          };
          tref = setTimeout(function () {
            debug('timeout');
            self.sendStop = null;
            self.sendSchedule();
          }, 25);
        };

        BufferedSender.prototype.sendSchedule = function () {
          debug('sendSchedule', this.sendBuffer.length);
          var self = this;
          if (this.sendBuffer.length > 0) {
            var payload = '[' + this.sendBuffer.join(',') + ']';
            this.sendStop = this.sender(this.url, payload, function (err) {
              self.sendStop = null;
              if (err) {
                debug('error', err);
                self.emit('close', err.code || 1006, 'Sending error: ' + err);
                self.close();
              } else {
                self.sendScheduleWait();
              }
            });
            this.sendBuffer = [];
          }
        };

        BufferedSender.prototype._cleanup = function () {
          debug('_cleanup');
          this.removeAllListeners();
        };

        BufferedSender.prototype.close = function () {
          debug('close');
          this._cleanup();
          if (this.sendStop) {
            this.sendStop();
            this.sendStop = null;
          }
        };

        module.exports = BufferedSender;
      }).call(this, { env: {} });
    }, { "debug": 54, "events": 3, "inherits": 56 }], 26: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var inherits = require('inherits'),
            IframeTransport = require('../iframe'),
            objectUtils = require('../../utils/object');

        module.exports = function (transport) {

          function IframeWrapTransport(transUrl, baseUrl) {
            IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
          }

          inherits(IframeWrapTransport, IframeTransport);

          IframeWrapTransport.enabled = function (url, info) {
            if (!global.document) {
              return false;
            }

            var iframeInfo = objectUtils.extend({}, info);
            iframeInfo.sameOrigin = true;
            return transport.enabled(iframeInfo) && IframeTransport.enabled();
          };

          IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
          IframeWrapTransport.needBody = true;
          IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

          IframeWrapTransport.facadeTransport = transport;

          return IframeWrapTransport;
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/object": 49, "../iframe": 22, "inherits": 56 }], 27: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:polling');
        }

        function Polling(Receiver, receiveUrl, AjaxObject) {
          debug(receiveUrl);
          EventEmitter.call(this);
          this.Receiver = Receiver;
          this.receiveUrl = receiveUrl;
          this.AjaxObject = AjaxObject;
          this._scheduleReceiver();
        }

        inherits(Polling, EventEmitter);

        Polling.prototype._scheduleReceiver = function () {
          debug('_scheduleReceiver');
          var self = this;
          var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

          poll.on('message', function (msg) {
            debug('message', msg);
            self.emit('message', msg);
          });

          poll.once('close', function (code, reason) {
            debug('close', code, reason, self.pollIsClosing);
            self.poll = poll = null;

            if (!self.pollIsClosing) {
              if (reason === 'network') {
                self._scheduleReceiver();
              } else {
                self.emit('close', code || 1006, reason);
                self.removeAllListeners();
              }
            }
          });
        };

        Polling.prototype.abort = function () {
          debug('abort');
          this.removeAllListeners();
          this.pollIsClosing = true;
          if (this.poll) {
            this.poll.abort();
          }
        };

        module.exports = Polling;
      }).call(this, { env: {} });
    }, { "debug": 54, "events": 3, "inherits": 56 }], 28: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            BufferedSender = require('./buffered-sender'),
            Polling = require('./polling');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:sender-receiver');
        }

        function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
          var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
          debug(pollUrl);
          var self = this;
          BufferedSender.call(this, transUrl, senderFunc);

          this.poll = new Polling(Receiver, pollUrl, AjaxObject);
          this.poll.on('message', function (msg) {
            debug('poll message', msg);
            self.emit('message', msg);
          });
          this.poll.once('close', function (code, reason) {
            debug('poll close', code, reason);
            self.poll = null;
            self.emit('close', code, reason);
            self.close();
          });
        }

        inherits(SenderReceiver, BufferedSender);

        SenderReceiver.prototype.close = function () {
          BufferedSender.prototype.close.call(this);
          debug('close');
          this.removeAllListeners();
          if (this.poll) {
            this.poll.abort();
            this.poll = null;
          }
        };

        module.exports = SenderReceiver;
      }).call(this, { env: {} });
    }, { "../../utils/url": 52, "./buffered-sender": 25, "./polling": 27, "debug": 54, "inherits": 56 }], 29: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            EventSourceDriver = require('eventsource');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:eventsource');
        }

        function EventSourceReceiver(url) {
          debug(url);
          EventEmitter.call(this);

          var self = this;
          var es = this.es = new EventSourceDriver(url);
          es.onmessage = function (e) {
            debug('message', e.data);
            self.emit('message', decodeURI(e.data));
          };
          es.onerror = function (e) {
            debug('error', es.readyState, e);
            // ES on reconnection has readyState = 0 or 1.
            // on network error it's CLOSED = 2
            var reason = es.readyState !== 2 ? 'network' : 'permanent';
            self._cleanup();
            self._close(reason);
          };
        }

        inherits(EventSourceReceiver, EventEmitter);

        EventSourceReceiver.prototype.abort = function () {
          debug('abort');
          this._cleanup();
          this._close('user');
        };

        EventSourceReceiver.prototype._cleanup = function () {
          debug('cleanup');
          var es = this.es;
          if (es) {
            es.onmessage = es.onerror = null;
            es.close();
            this.es = null;
          }
        };

        EventSourceReceiver.prototype._close = function (reason) {
          debug('close', reason);
          var self = this;
          // Safari and chrome < 15 crash if we close window before
          // waiting for ES cleanup. See:
          // https://code.google.com/p/chromium/issues/detail?id=89155
          setTimeout(function () {
            self.emit('close', null, reason);
            self.removeAllListeners();
          }, 200);
        };

        module.exports = EventSourceReceiver;
      }).call(this, { env: {} });
    }, { "debug": 54, "events": 3, "eventsource": 18, "inherits": 56 }], 30: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var inherits = require('inherits'),
            iframeUtils = require('../../utils/iframe'),
            urlUtils = require('../../utils/url'),
            EventEmitter = require('events').EventEmitter,
            random = require('../../utils/random');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:htmlfile');
        }

        function HtmlfileReceiver(url) {
          debug(url);
          EventEmitter.call(this);
          var self = this;
          iframeUtils.polluteGlobalNamespace();

          this.id = 'a' + random.string(6);
          url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

          debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
          var constructFunc = HtmlfileReceiver.htmlfileEnabled ? iframeUtils.createHtmlfile : iframeUtils.createIframe;

          global[iframeUtils.WPrefix][this.id] = {
            start: function () {
              debug('start');
              self.iframeObj.loaded();
            },
            message: function (data) {
              debug('message', data);
              self.emit('message', data);
            },
            stop: function () {
              debug('stop');
              self._cleanup();
              self._close('network');
            }
          };
          this.iframeObj = constructFunc(url, function () {
            debug('callback');
            self._cleanup();
            self._close('permanent');
          });
        }

        inherits(HtmlfileReceiver, EventEmitter);

        HtmlfileReceiver.prototype.abort = function () {
          debug('abort');
          this._cleanup();
          this._close('user');
        };

        HtmlfileReceiver.prototype._cleanup = function () {
          debug('_cleanup');
          if (this.iframeObj) {
            this.iframeObj.cleanup();
            this.iframeObj = null;
          }
          delete global[iframeUtils.WPrefix][this.id];
        };

        HtmlfileReceiver.prototype._close = function (reason) {
          debug('_close', reason);
          this.emit('close', null, reason);
          this.removeAllListeners();
        };

        HtmlfileReceiver.htmlfileEnabled = false;

        // obfuscate to avoid firewalls
        var axo = ['Active'].concat('Object').join('X');
        if (axo in global) {
          try {
            HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
          } catch (x) {
            // intentionally empty
          }
        }

        HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

        module.exports = HtmlfileReceiver;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/iframe": 47, "../../utils/random": 50, "../../utils/url": 52, "debug": 54, "events": 3, "inherits": 56 }], 31: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var utils = require('../../utils/iframe'),
            random = require('../../utils/random'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:jsonp');
        }

        function JsonpReceiver(url) {
          debug(url);
          var self = this;
          EventEmitter.call(this);

          utils.polluteGlobalNamespace();

          this.id = 'a' + random.string(6);
          var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

          global[utils.WPrefix][this.id] = this._callback.bind(this);
          this._createScript(urlWithId);

          // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
          this.timeoutId = setTimeout(function () {
            debug('timeout');
            self._abort(new Error('JSONP script loaded abnormally (timeout)'));
          }, JsonpReceiver.timeout);
        }

        inherits(JsonpReceiver, EventEmitter);

        JsonpReceiver.prototype.abort = function () {
          debug('abort');
          if (global[utils.WPrefix][this.id]) {
            var err = new Error('JSONP user aborted read');
            err.code = 1000;
            this._abort(err);
          }
        };

        JsonpReceiver.timeout = 35000;
        JsonpReceiver.scriptErrorTimeout = 1000;

        JsonpReceiver.prototype._callback = function (data) {
          debug('_callback', data);
          this._cleanup();

          if (this.aborting) {
            return;
          }

          if (data) {
            debug('message', data);
            this.emit('message', data);
          }
          this.emit('close', null, 'network');
          this.removeAllListeners();
        };

        JsonpReceiver.prototype._abort = function (err) {
          debug('_abort', err);
          this._cleanup();
          this.aborting = true;
          this.emit('close', err.code, err.message);
          this.removeAllListeners();
        };

        JsonpReceiver.prototype._cleanup = function () {
          debug('_cleanup');
          clearTimeout(this.timeoutId);
          if (this.script2) {
            this.script2.parentNode.removeChild(this.script2);
            this.script2 = null;
          }
          if (this.script) {
            var script = this.script;
            // Unfortunately, you can't really abort script loading of
            // the script.
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror = script.onload = script.onclick = null;
            this.script = null;
          }
          delete global[utils.WPrefix][this.id];
        };

        JsonpReceiver.prototype._scriptError = function () {
          debug('_scriptError');
          var self = this;
          if (this.errorTimer) {
            return;
          }

          this.errorTimer = setTimeout(function () {
            if (!self.loadedOkay) {
              self._abort(new Error('JSONP script loaded abnormally (onerror)'));
            }
          }, JsonpReceiver.scriptErrorTimeout);
        };

        JsonpReceiver.prototype._createScript = function (url) {
          debug('_createScript', url);
          var self = this;
          var script = this.script = global.document.createElement('script');
          var script2; // Opera synchronous load trick.

          script.id = 'a' + random.string(8);
          script.src = url;
          script.type = 'text/javascript';
          script.charset = 'UTF-8';
          script.onerror = this._scriptError.bind(this);
          script.onload = function () {
            debug('onload');
            self._abort(new Error('JSONP script loaded abnormally (onload)'));
          };

          // IE9 fires 'error' event after onreadystatechange or before, in random order.
          // Use loadedOkay to determine if actually errored
          script.onreadystatechange = function () {
            debug('onreadystatechange', script.readyState);
            if (/loaded|closed/.test(script.readyState)) {
              if (script && script.htmlFor && script.onclick) {
                self.loadedOkay = true;
                try {
                  // In IE, actually execute the script.
                  script.onclick();
                } catch (x) {
                  // intentionally empty
                }
              }
              if (script) {
                self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
              }
            }
          };
          // IE: event/htmlFor/onclick trick.
          // One can't rely on proper order for onreadystatechange. In order to
          // make sure, set a 'htmlFor' and 'event' properties, so that
          // script code will be installed as 'onclick' handler for the
          // script object. Later, onreadystatechange, manually execute this
          // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
          // set. For reference see:
          //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
          // Also, read on that about script ordering:
          //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
          if (typeof script.async === 'undefined' && global.document.attachEvent) {
            // According to mozilla docs, in recent browsers script.async defaults
            // to 'true', so we may use it to detect a good browser:
            // https://developer.mozilla.org/en/HTML/Element/script
            if (!browser.isOpera()) {
              // Naively assume we're in IE
              try {
                script.htmlFor = script.id;
                script.event = 'onclick';
              } catch (x) {
                // intentionally empty
              }
              script.async = true;
            } else {
              // Opera, second sync script hack
              script2 = this.script2 = global.document.createElement('script');
              script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
              script.async = script2.async = false;
            }
          }
          if (typeof script.async !== 'undefined') {
            script.async = true;
          }

          var head = global.document.getElementsByTagName('head')[0];
          head.insertBefore(script, head.firstChild);
          if (script2) {
            head.insertBefore(script2, head.firstChild);
          }
        };

        module.exports = JsonpReceiver;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/browser": 44, "../../utils/iframe": 47, "../../utils/random": 50, "../../utils/url": 52, "debug": 54, "events": 3, "inherits": 56 }], 32: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:xhr');
        }

        function XhrReceiver(url, AjaxObject) {
          debug(url);
          EventEmitter.call(this);
          var self = this;

          this.bufferPosition = 0;

          this.xo = new AjaxObject('POST', url, null);
          this.xo.on('chunk', this._chunkHandler.bind(this));
          this.xo.once('finish', function (status, text) {
            debug('finish', status, text);
            self._chunkHandler(status, text);
            self.xo = null;
            var reason = status === 200 ? 'network' : 'permanent';
            debug('close', reason);
            self.emit('close', null, reason);
            self._cleanup();
          });
        }

        inherits(XhrReceiver, EventEmitter);

        XhrReceiver.prototype._chunkHandler = function (status, text) {
          debug('_chunkHandler', status);
          if (status !== 200 || !text) {
            return;
          }

          for (var idx = -1;; this.bufferPosition += idx + 1) {
            var buf = text.slice(this.bufferPosition);
            idx = buf.indexOf('\n');
            if (idx === -1) {
              break;
            }
            var msg = buf.slice(0, idx);
            if (msg) {
              debug('message', msg);
              this.emit('message', msg);
            }
          }
        };

        XhrReceiver.prototype._cleanup = function () {
          debug('_cleanup');
          this.removeAllListeners();
        };

        XhrReceiver.prototype.abort = function () {
          debug('abort');
          if (this.xo) {
            this.xo.close();
            debug('close');
            this.emit('close', null, 'user');
            this.xo = null;
          }
          this._cleanup();
        };

        module.exports = XhrReceiver;
      }).call(this, { env: {} });
    }, { "debug": 54, "events": 3, "inherits": 56 }], 33: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var random = require('../../utils/random'),
            urlUtils = require('../../utils/url');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:sender:jsonp');
        }

        var form, area;

        function createIframe(id) {
          debug('createIframe', id);
          try {
            // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
            return global.document.createElement('<iframe name="' + id + '">');
          } catch (x) {
            var iframe = global.document.createElement('iframe');
            iframe.name = id;
            return iframe;
          }
        }

        function createForm() {
          debug('createForm');
          form = global.document.createElement('form');
          form.style.display = 'none';
          form.style.position = 'absolute';
          form.method = 'POST';
          form.enctype = 'application/x-www-form-urlencoded';
          form.acceptCharset = 'UTF-8';

          area = global.document.createElement('textarea');
          area.name = 'd';
          form.appendChild(area);

          global.document.body.appendChild(form);
        }

        module.exports = function (url, payload, callback) {
          debug(url, payload);
          if (!form) {
            createForm();
          }
          var id = 'a' + random.string(8);
          form.target = id;
          form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

          var iframe = createIframe(id);
          iframe.id = id;
          iframe.style.display = 'none';
          form.appendChild(iframe);

          try {
            area.value = payload;
          } catch (e) {
            // seriously broken browsers get here
          }
          form.submit();

          var completed = function (err) {
            debug('completed', id, err);
            if (!iframe.onerror) {
              return;
            }
            iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
            // Opera mini doesn't like if we GC iframe
            // immediately, thus this timeout.
            setTimeout(function () {
              debug('cleaning up', id);
              iframe.parentNode.removeChild(iframe);
              iframe = null;
            }, 500);
            area.value = '';
            // It is not possible to detect if the iframe succeeded or
            // failed to submit our form.
            callback(err);
          };
          iframe.onerror = function () {
            debug('onerror', id);
            completed();
          };
          iframe.onload = function () {
            debug('onload', id);
            completed();
          };
          iframe.onreadystatechange = function (e) {
            debug('onreadystatechange', id, iframe.readyState, e);
            if (iframe.readyState === 'complete') {
              completed();
            }
          };
          return function () {
            debug('aborted', id);
            completed(new Error('Aborted'));
          };
        };
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/random": 50, "../../utils/url": 52, "debug": 54 }], 34: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            eventUtils = require('../../utils/event'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:sender:xdr');
        }

        // References:
        //   http://ajaxian.com/archives/100-line-ajax-wrapper
        //   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

        function XDRObject(method, url, payload) {
          debug(method, url);
          var self = this;
          EventEmitter.call(this);

          setTimeout(function () {
            self._start(method, url, payload);
          }, 0);
        }

        inherits(XDRObject, EventEmitter);

        XDRObject.prototype._start = function (method, url, payload) {
          debug('_start');
          var self = this;
          var xdr = new global.XDomainRequest();
          // IE caches even POSTs
          url = urlUtils.addQuery(url, 't=' + +new Date());

          xdr.onerror = function () {
            debug('onerror');
            self._error();
          };
          xdr.ontimeout = function () {
            debug('ontimeout');
            self._error();
          };
          xdr.onprogress = function () {
            debug('progress', xdr.responseText);
            self.emit('chunk', 200, xdr.responseText);
          };
          xdr.onload = function () {
            debug('load');
            self.emit('finish', 200, xdr.responseText);
            self._cleanup(false);
          };
          this.xdr = xdr;
          this.unloadRef = eventUtils.unloadAdd(function () {
            self._cleanup(true);
          });
          try {
            // Fails with AccessDenied if port number is bogus
            this.xdr.open(method, url);
            if (this.timeout) {
              this.xdr.timeout = this.timeout;
            }
            this.xdr.send(payload);
          } catch (x) {
            this._error();
          }
        };

        XDRObject.prototype._error = function () {
          this.emit('finish', 0, '');
          this._cleanup(false);
        };

        XDRObject.prototype._cleanup = function (abort) {
          debug('cleanup', abort);
          if (!this.xdr) {
            return;
          }
          this.removeAllListeners();
          eventUtils.unloadDel(this.unloadRef);

          this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
          if (abort) {
            try {
              this.xdr.abort();
            } catch (x) {
              // intentionally empty
            }
          }
          this.unloadRef = this.xdr = null;
        };

        XDRObject.prototype.close = function () {
          debug('close');
          this._cleanup(true);
        };

        // IE 8/9 if the request target uses the same scheme - #79
        XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

        module.exports = XDRObject;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/browser": 44, "../../utils/event": 46, "../../utils/url": 52, "debug": 54, "events": 3, "inherits": 56 }], 35: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          XhrDriver = require('../driver/xhr');

      function XHRCorsObject(method, url, payload, opts) {
        XhrDriver.call(this, method, url, payload, opts);
      }

      inherits(XHRCorsObject, XhrDriver);

      XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

      module.exports = XHRCorsObject;
    }, { "../driver/xhr": 17, "inherits": 56 }], 36: [function (require, module, exports) {
      'use strict';

      var EventEmitter = require('events').EventEmitter,
          inherits = require('inherits');

      function XHRFake() /* method, url, payload, opts */{
        var self = this;
        EventEmitter.call(this);

        this.to = setTimeout(function () {
          self.emit('finish', 200, '{}');
        }, XHRFake.timeout);
      }

      inherits(XHRFake, EventEmitter);

      XHRFake.prototype.close = function () {
        clearTimeout(this.to);
      };

      XHRFake.timeout = 2000;

      module.exports = XHRFake;
    }, { "events": 3, "inherits": 56 }], 37: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          XhrDriver = require('../driver/xhr');

      function XHRLocalObject(method, url, payload /*, opts */) {
        XhrDriver.call(this, method, url, payload, {
          noCredentials: true
        });
      }

      inherits(XHRLocalObject, XhrDriver);

      XHRLocalObject.enabled = XhrDriver.enabled;

      module.exports = XHRLocalObject;
    }, { "../driver/xhr": 17, "inherits": 56 }], 38: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var utils = require('../utils/event'),
            urlUtils = require('../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            WebsocketDriver = require('./driver/websocket');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:websocket');
        }

        function WebSocketTransport(transUrl, ignore, options) {
          if (!WebSocketTransport.enabled()) {
            throw new Error('Transport created when disabled');
          }

          EventEmitter.call(this);
          debug('constructor', transUrl);

          var self = this;
          var url = urlUtils.addPath(transUrl, '/websocket');
          if (url.slice(0, 5) === 'https') {
            url = 'wss' + url.slice(5);
          } else {
            url = 'ws' + url.slice(4);
          }
          this.url = url;

          this.ws = new WebsocketDriver(this.url, [], options);
          this.ws.onmessage = function (e) {
            debug('message event', e.data);
            self.emit('message', e.data);
          };
          // Firefox has an interesting bug. If a websocket connection is
          // created after onunload, it stays alive even when user
          // navigates away from the page. In such situation let's lie -
          // let's not open the ws connection at all. See:
          // https://github.com/sockjs/sockjs-client/issues/28
          // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
          this.unloadRef = utils.unloadAdd(function () {
            debug('unload');
            self.ws.close();
          });
          this.ws.onclose = function (e) {
            debug('close event', e.code, e.reason);
            self.emit('close', e.code, e.reason);
            self._cleanup();
          };
          this.ws.onerror = function (e) {
            debug('error event', e);
            self.emit('close', 1006, 'WebSocket connection broken');
            self._cleanup();
          };
        }

        inherits(WebSocketTransport, EventEmitter);

        WebSocketTransport.prototype.send = function (data) {
          var msg = '[' + data + ']';
          debug('send', msg);
          this.ws.send(msg);
        };

        WebSocketTransport.prototype.close = function () {
          debug('close');
          var ws = this.ws;
          this._cleanup();
          if (ws) {
            ws.close();
          }
        };

        WebSocketTransport.prototype._cleanup = function () {
          debug('_cleanup');
          var ws = this.ws;
          if (ws) {
            ws.onmessage = ws.onclose = ws.onerror = null;
          }
          utils.unloadDel(this.unloadRef);
          this.unloadRef = this.ws = null;
          this.removeAllListeners();
        };

        WebSocketTransport.enabled = function () {
          debug('enabled');
          return !!WebsocketDriver;
        };
        WebSocketTransport.transportName = 'websocket';

        // In theory, ws should require 1 round trip. But in chrome, this is
        // not very stable over SSL. Most likely a ws connection requires a
        // separate SSL connection, in which case 2 round trips are an
        // absolute minumum.
        WebSocketTransport.roundTrips = 2;

        module.exports = WebSocketTransport;
      }).call(this, { env: {} });
    }, { "../utils/event": 46, "../utils/url": 52, "./driver/websocket": 19, "debug": 54, "events": 3, "inherits": 56 }], 39: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          XdrStreamingTransport = require('./xdr-streaming'),
          XhrReceiver = require('./receiver/xhr'),
          XDRObject = require('./sender/xdr');

      function XdrPollingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
      }

      inherits(XdrPollingTransport, AjaxBasedTransport);

      XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
      XdrPollingTransport.transportName = 'xdr-polling';
      XdrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrPollingTransport;
    }, { "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xdr": 34, "./xdr-streaming": 40, "inherits": 56 }], 40: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          XhrReceiver = require('./receiver/xhr'),
          XDRObject = require('./sender/xdr');

      // According to:
      //   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
      //   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

      function XdrStreamingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
      }

      inherits(XdrStreamingTransport, AjaxBasedTransport);

      XdrStreamingTransport.enabled = function (info) {
        if (info.cookie_needed || info.nullOrigin) {
          return false;
        }
        return XDRObject.enabled && info.sameScheme;
      };

      XdrStreamingTransport.transportName = 'xdr-streaming';
      XdrStreamingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrStreamingTransport;
    }, { "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xdr": 34, "inherits": 56 }], 41: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          XhrReceiver = require('./receiver/xhr'),
          XHRCorsObject = require('./sender/xhr-cors'),
          XHRLocalObject = require('./sender/xhr-local');

      function XhrPollingTransport(transUrl) {
        if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
      }

      inherits(XhrPollingTransport, AjaxBasedTransport);

      XhrPollingTransport.enabled = function (info) {
        if (info.nullOrigin) {
          return false;
        }

        if (XHRLocalObject.enabled && info.sameOrigin) {
          return true;
        }
        return XHRCorsObject.enabled;
      };

      XhrPollingTransport.transportName = 'xhr-polling';
      XhrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XhrPollingTransport;
    }, { "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xhr-cors": 35, "./sender/xhr-local": 37, "inherits": 56 }], 42: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var inherits = require('inherits'),
            AjaxBasedTransport = require('./lib/ajax-based'),
            XhrReceiver = require('./receiver/xhr'),
            XHRCorsObject = require('./sender/xhr-cors'),
            XHRLocalObject = require('./sender/xhr-local'),
            browser = require('../utils/browser');

        function XhrStreamingTransport(transUrl) {
          if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
            throw new Error('Transport created when disabled');
          }
          AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
        }

        inherits(XhrStreamingTransport, AjaxBasedTransport);

        XhrStreamingTransport.enabled = function (info) {
          if (info.nullOrigin) {
            return false;
          }
          // Opera doesn't support xhr-streaming #60
          // But it might be able to #92
          if (browser.isOpera()) {
            return false;
          }

          return XHRCorsObject.enabled;
        };

        XhrStreamingTransport.transportName = 'xhr-streaming';
        XhrStreamingTransport.roundTrips = 2; // preflight, ajax

        // Safari gets confused when a streaming ajax request is started
        // before onload. This causes the load indicator to spin indefinetely.
        // Only require body when used in a browser
        XhrStreamingTransport.needBody = !!global.document;

        module.exports = XhrStreamingTransport;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../utils/browser": 44, "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xhr-cors": 35, "./sender/xhr-local": 37, "inherits": 56 }], 43: [function (require, module, exports) {
      (function (global) {
        'use strict';

        if (global.crypto && global.crypto.getRandomValues) {
          module.exports.randomBytes = function (length) {
            var bytes = new Uint8Array(length);
            global.crypto.getRandomValues(bytes);
            return bytes;
          };
        } else {
          module.exports.randomBytes = function (length) {
            var bytes = new Array(length);
            for (var i = 0; i < length; i++) {
              bytes[i] = Math.floor(Math.random() * 256);
            }
            return bytes;
          };
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 44: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = {
          isOpera: function () {
            return global.navigator && /opera/i.test(global.navigator.userAgent);
          },

          isKonqueror: function () {
            return global.navigator && /konqueror/i.test(global.navigator.userAgent);
          }

          // #187 wrap document.domain in try/catch because of WP8 from file:///
          , hasDomain: function () {
            // non-browser client always has a domain
            if (!global.document) {
              return true;
            }

            try {
              return !!global.document.domain;
            } catch (e) {
              return false;
            }
          }
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 45: [function (require, module, exports) {
      'use strict';

      var JSON3 = require('json3');

      // Some extra characters that Chrome gets wrong, and substitutes with
      // something else on the wire.
      // eslint-disable-next-line no-control-regex
      var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
          extraLookup;

      // This may be quite slow, so let's delay until user actually uses bad
      // characters.
      var unrollLookup = function (escapable) {
        var i;
        var unrolled = {};
        var c = [];
        for (i = 0; i < 65536; i++) {
          c.push(String.fromCharCode(i));
        }
        escapable.lastIndex = 0;
        c.join('').replace(escapable, function (a) {
          unrolled[a] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          return '';
        });
        escapable.lastIndex = 0;
        return unrolled;
      };

      // Quote string, also taking care of unicode characters that browsers
      // often break. Especially, take care of unicode surrogates:
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
      module.exports = {
        quote: function (string) {
          var quoted = JSON3.stringify(string);

          // In most cases this should be very fast and good enough.
          extraEscapable.lastIndex = 0;
          if (!extraEscapable.test(quoted)) {
            return quoted;
          }

          if (!extraLookup) {
            extraLookup = unrollLookup(extraEscapable);
          }

          return quoted.replace(extraEscapable, function (a) {
            return extraLookup[a];
          });
        }
      };
    }, { "json3": 57 }], 46: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var random = require('./random');

        var onUnload = {},
            afterUnload = false
        // detect google chrome packaged apps because they don't allow the 'unload' event
        ,
            isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime;

        module.exports = {
          attachEvent: function (event, listener) {
            if (typeof global.addEventListener !== 'undefined') {
              global.addEventListener(event, listener, false);
            } else if (global.document && global.attachEvent) {
              // IE quirks.
              // According to: http://stevesouders.com/misc/test-postmessage.php
              // the message gets delivered only to 'document', not 'window'.
              global.document.attachEvent('on' + event, listener);
              // I get 'window' for ie8.
              global.attachEvent('on' + event, listener);
            }
          },

          detachEvent: function (event, listener) {
            if (typeof global.addEventListener !== 'undefined') {
              global.removeEventListener(event, listener, false);
            } else if (global.document && global.detachEvent) {
              global.document.detachEvent('on' + event, listener);
              global.detachEvent('on' + event, listener);
            }
          },

          unloadAdd: function (listener) {
            if (isChromePackagedApp) {
              return null;
            }

            var ref = random.string(8);
            onUnload[ref] = listener;
            if (afterUnload) {
              setTimeout(this.triggerUnloadCallbacks, 0);
            }
            return ref;
          },

          unloadDel: function (ref) {
            if (ref in onUnload) {
              delete onUnload[ref];
            }
          },

          triggerUnloadCallbacks: function () {
            for (var ref in onUnload) {
              onUnload[ref]();
              delete onUnload[ref];
            }
          }
        };

        var unloadTriggered = function () {
          if (afterUnload) {
            return;
          }
          afterUnload = true;
          module.exports.triggerUnloadCallbacks();
        };

        // 'unload' alone is not reliable in opera within an iframe, but we
        // can't use `beforeunload` as IE fires it on javascript: links.
        if (!isChromePackagedApp) {
          module.exports.attachEvent('unload', unloadTriggered);
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./random": 50 }], 47: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var eventUtils = require('./event'),
            JSON3 = require('json3'),
            browser = require('./browser');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:utils:iframe');
        }

        module.exports = {
          WPrefix: '_jp',
          currentWindowId: null,

          polluteGlobalNamespace: function () {
            if (!(module.exports.WPrefix in global)) {
              global[module.exports.WPrefix] = {};
            }
          },

          postMessage: function (type, data) {
            if (global.parent !== global) {
              global.parent.postMessage(JSON3.stringify({
                windowId: module.exports.currentWindowId,
                type: type,
                data: data || ''
              }), '*');
            } else {
              debug('Cannot postMessage, no parent window.', type, data);
            }
          },

          createIframe: function (iframeUrl, errorCallback) {
            var iframe = global.document.createElement('iframe');
            var tref, unloadRef;
            var unattach = function () {
              debug('unattach');
              clearTimeout(tref);
              // Explorer had problems with that.
              try {
                iframe.onload = null;
              } catch (x) {
                // intentionally empty
              }
              iframe.onerror = null;
            };
            var cleanup = function () {
              debug('cleanup');
              if (iframe) {
                unattach();
                // This timeout makes chrome fire onbeforeunload event
                // within iframe. Without the timeout it goes straight to
                // onunload.
                setTimeout(function () {
                  if (iframe) {
                    iframe.parentNode.removeChild(iframe);
                  }
                  iframe = null;
                }, 0);
                eventUtils.unloadDel(unloadRef);
              }
            };
            var onerror = function (err) {
              debug('onerror', err);
              if (iframe) {
                cleanup();
                errorCallback(err);
              }
            };
            var post = function (msg, origin) {
              debug('post', msg, origin);
              setTimeout(function () {
                try {
                  // When the iframe is not loaded, IE raises an exception
                  // on 'contentWindow'.
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(msg, origin);
                  }
                } catch (x) {
                  // intentionally empty
                }
              }, 0);
            };

            iframe.src = iframeUrl;
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.onerror = function () {
              onerror('onerror');
            };
            iframe.onload = function () {
              debug('onload');
              // `onload` is triggered before scripts on the iframe are
              // executed. Give it few seconds to actually load stuff.
              clearTimeout(tref);
              tref = setTimeout(function () {
                onerror('onload timeout');
              }, 2000);
            };
            global.document.body.appendChild(iframe);
            tref = setTimeout(function () {
              onerror('timeout');
            }, 15000);
            unloadRef = eventUtils.unloadAdd(cleanup);
            return {
              post: post,
              cleanup: cleanup,
              loaded: unattach
            };
          }

          /* eslint no-undef: "off", new-cap: "off" */
          , createHtmlfile: function (iframeUrl, errorCallback) {
            var axo = ['Active'].concat('Object').join('X');
            var doc = new global[axo]('htmlfile');
            var tref, unloadRef;
            var iframe;
            var unattach = function () {
              clearTimeout(tref);
              iframe.onerror = null;
            };
            var cleanup = function () {
              if (doc) {
                unattach();
                eventUtils.unloadDel(unloadRef);
                iframe.parentNode.removeChild(iframe);
                iframe = doc = null;
                CollectGarbage();
              }
            };
            var onerror = function (r) {
              debug('onerror', r);
              if (doc) {
                cleanup();
                errorCallback(r);
              }
            };
            var post = function (msg, origin) {
              try {
                // When the iframe is not loaded, IE raises an exception
                // on 'contentWindow'.
                setTimeout(function () {
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(msg, origin);
                  }
                }, 0);
              } catch (x) {
                // intentionally empty
              }
            };

            doc.open();
            doc.write('<html><s' + 'cript>' + 'document.domain="' + global.document.domain + '";' + '</s' + 'cript></html>');
            doc.close();
            doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
            var c = doc.createElement('div');
            doc.body.appendChild(c);
            iframe = doc.createElement('iframe');
            c.appendChild(iframe);
            iframe.src = iframeUrl;
            iframe.onerror = function () {
              onerror('onerror');
            };
            tref = setTimeout(function () {
              onerror('timeout');
            }, 15000);
            unloadRef = eventUtils.unloadAdd(cleanup);
            return {
              post: post,
              cleanup: cleanup,
              loaded: unattach
            };
          }
        };

        module.exports.iframeEnabled = false;
        if (global.document) {
          // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
          // huge delay, or not at all.
          module.exports.iframeEnabled = (typeof global.postMessage === 'function' || typeof global.postMessage === 'object') && !browser.isKonqueror();
        }
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./browser": 44, "./event": 46, "debug": 54, "json3": 57 }], 48: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var logObject = {};
        ['log', 'debug', 'warn'].forEach(function (level) {
          var levelExists;

          try {
            levelExists = global.console && global.console[level] && global.console[level].apply;
          } catch (e) {
            // do nothing
          }

          logObject[level] = levelExists ? function () {
            return global.console[level].apply(global.console, arguments);
          } : level === 'log' ? function () {} : logObject.log;
        });

        module.exports = logObject;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 49: [function (require, module, exports) {
      'use strict';

      module.exports = {
        isObject: function (obj) {
          var type = typeof obj;
          return type === 'function' || type === 'object' && !!obj;
        },

        extend: function (obj) {
          if (!this.isObject(obj)) {
            return obj;
          }
          var source, prop;
          for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
              if (Object.prototype.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
              }
            }
          }
          return obj;
        }
      };
    }, {}], 50: [function (require, module, exports) {
      'use strict';

      /* global crypto:true */

      var crypto = require('crypto');

      // This string has length 32, a power of 2, so the modulus doesn't introduce a
      // bias.
      var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
      module.exports = {
        string: function (length) {
          var max = _randomStringChars.length;
          var bytes = crypto.randomBytes(length);
          var ret = [];
          for (var i = 0; i < length; i++) {
            ret.push(_randomStringChars.substr(bytes[i] % max, 1));
          }
          return ret.join('');
        },

        number: function (max) {
          return Math.floor(Math.random() * max);
        },

        numberString: function (max) {
          var t = ('' + (max - 1)).length;
          var p = new Array(t + 1).join('0');
          return (p + this.number(max)).slice(-t);
        }
      };
    }, { "crypto": 43 }], 51: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:utils:transport');
        }

        module.exports = function (availableTransports) {
          return {
            filterToEnabled: function (transportsWhitelist, info) {
              var transports = {
                main: [],
                facade: []
              };
              if (!transportsWhitelist) {
                transportsWhitelist = [];
              } else if (typeof transportsWhitelist === 'string') {
                transportsWhitelist = [transportsWhitelist];
              }

              availableTransports.forEach(function (trans) {
                if (!trans) {
                  return;
                }

                if (trans.transportName === 'websocket' && info.websocket === false) {
                  debug('disabled from server', 'websocket');
                  return;
                }

                if (transportsWhitelist.length && transportsWhitelist.indexOf(trans.transportName) === -1) {
                  debug('not in whitelist', trans.transportName);
                  return;
                }

                if (trans.enabled(info)) {
                  debug('enabled', trans.transportName);
                  transports.main.push(trans);
                  if (trans.facadeTransport) {
                    transports.facade.push(trans.facadeTransport);
                  }
                } else {
                  debug('disabled', trans.transportName);
                }
              });
              return transports;
            }
          };
        };
      }).call(this, { env: {} });
    }, { "debug": 54 }], 52: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var URL = require('url-parse');

        var debug = function () {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:utils:url');
        }

        module.exports = {
          getOrigin: function (url) {
            if (!url) {
              return null;
            }

            var p = new URL(url);
            if (p.protocol === 'file:') {
              return null;
            }

            var port = p.port;
            if (!port) {
              port = p.protocol === 'https:' ? '443' : '80';
            }

            return p.protocol + '//' + p.hostname + ':' + port;
          },

          isOriginEqual: function (a, b) {
            var res = this.getOrigin(a) === this.getOrigin(b);
            debug('same', a, b, res);
            return res;
          },

          isSchemeEqual: function (a, b) {
            return a.split(':')[0] === b.split(':')[0];
          },

          addPath: function (url, path) {
            var qs = url.split('?');
            return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
          },

          addQuery: function (url, q) {
            return url + (url.indexOf('?') === -1 ? '?' + q : '&' + q);
          }
        };
      }).call(this, { env: {} });
    }, { "debug": 54, "url-parse": 61 }], 53: [function (require, module, exports) {
      module.exports = '1.1.5';
    }, {}], 54: [function (require, module, exports) {
      (function (process) {
        /**
         * This is the web browser implementation of `debug()`.
         *
         * Expose `debug()` as the module.
         */

        exports = module.exports = require('./debug');
        exports.log = log;
        exports.formatArgs = formatArgs;
        exports.save = save;
        exports.load = load;
        exports.useColors = useColors;
        exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

        /**
         * Colors.
         */

        exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

        /**
         * Currently only WebKit-based Web Inspectors, Firefox >= v31,
         * and the Firebug extension (any Firefox version) are known
         * to support "%c" CSS customizations.
         *
         * TODO: add a `localStorage` variable to explicitly enable/disable colors
         */

        function useColors() {
          // NB: In an Electron preload script, document will be defined but not fully
          // initialized. Since we know we're in Chrome, we'll just detect this case
          // explicitly
          if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
            return true;
          }

          // is webkit? http://stackoverflow.com/a/16459606/376773
          // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
          return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
          // is firebug? http://stackoverflow.com/a/398120/376773
          typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
          // is firefox >= v31?
          // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
          typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
          // double check webkit in userAgent just in case we are in a worker
          typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
        }

        /**
         * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
         */

        exports.formatters.j = function (v) {
          try {
            return JSON.stringify(v);
          } catch (err) {
            return '[UnexpectedJSONParseError]: ' + err.message;
          }
        };

        /**
         * Colorize log arguments if enabled.
         *
         * @api public
         */

        function formatArgs(args) {
          var useColors = this.useColors;

          args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

          if (!useColors) return;

          var c = 'color: ' + this.color;
          args.splice(1, 0, c, 'color: inherit');

          // the final "%c" is somewhat tricky, because there could be other
          // arguments passed either before or after the %c, so we need to
          // figure out the correct index to insert the CSS into
          var index = 0;
          var lastC = 0;
          args[0].replace(/%[a-zA-Z%]/g, function (match) {
            if ('%%' === match) return;
            index++;
            if ('%c' === match) {
              // we only are interested in the *last* %c
              // (the user may have provided their own)
              lastC = index;
            }
          });

          args.splice(lastC, 0, c);
        }

        /**
         * Invokes `console.log()` when available.
         * No-op when `console.log` is not a "function".
         *
         * @api public
         */

        function log() {
          // this hackery is required for IE8/9, where
          // the `console.log` function doesn't have 'apply'
          return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
        }

        /**
         * Save `namespaces`.
         *
         * @param {String} namespaces
         * @api private
         */

        function save(namespaces) {
          try {
            if (null == namespaces) {
              exports.storage.removeItem('debug');
            } else {
              exports.storage.debug = namespaces;
            }
          } catch (e) {}
        }

        /**
         * Load `namespaces`.
         *
         * @return {String} returns the previously persisted debug modes
         * @api private
         */

        function load() {
          var r;
          try {
            r = exports.storage.debug;
          } catch (e) {}

          // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
          if (!r && typeof process !== 'undefined' && 'env' in process) {
            r = process.env.DEBUG;
          }

          return r;
        }

        /**
         * Enable namespaces listed in `localStorage.debug` initially.
         */

        exports.enable(load());

        /**
         * Localstorage attempts to return the localstorage.
         *
         * This is necessary because safari throws
         * when a user disables cookies/localstorage
         * and you attempt to access it.
         *
         * @return {LocalStorage}
         * @api private
         */

        function localstorage() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
      }).call(this, { env: {} });
    }, { "./debug": 55 }], 55: [function (require, module, exports) {

      /**
       * This is the common logic for both the Node.js and web browser
       * implementations of `debug()`.
       *
       * Expose `debug()` as the module.
       */

      exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
      exports.coerce = coerce;
      exports.disable = disable;
      exports.enable = enable;
      exports.enabled = enabled;
      exports.humanize = require('ms');

      /**
       * The currently active debug mode names, and names to skip.
       */

      exports.names = [];
      exports.skips = [];

      /**
       * Map of special "%n" handling functions, for the debug "format" argument.
       *
       * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
       */

      exports.formatters = {};

      /**
       * Previous log timestamp.
       */

      var prevTime;

      /**
       * Select a color.
       * @param {String} namespace
       * @return {Number}
       * @api private
       */

      function selectColor(namespace) {
        var hash = 0,
            i;

        for (i in namespace) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }

        return exports.colors[Math.abs(hash) % exports.colors.length];
      }

      /**
       * Create a debugger with the given `namespace`.
       *
       * @param {String} namespace
       * @return {Function}
       * @api public
       */

      function createDebug(namespace) {

        function debug() {
          // disabled?
          if (!debug.enabled) return;

          var self = debug;

          // set `diff` timestamp
          var curr = +new Date();
          var ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;

          // turn the `arguments` into a proper Array
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }

          args[0] = exports.coerce(args[0]);

          if ('string' !== typeof args[0]) {
            // anything else let's inspect with %O
            args.unshift('%O');
          }

          // apply any `formatters` transformations
          var index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
            // if we encounter an escaped % then don't increase the array index
            if (match === '%%') return match;
            index++;
            var formatter = exports.formatters[format];
            if ('function' === typeof formatter) {
              var val = args[index];
              match = formatter.call(self, val);

              // now we need to remove `args[index]` since it's inlined in the `format`
              args.splice(index, 1);
              index--;
            }
            return match;
          });

          // apply env-specific formatting (colors, etc.)
          exports.formatArgs.call(self, args);

          var logFn = debug.log || exports.log || console.log.bind(console);
          logFn.apply(self, args);
        }

        debug.namespace = namespace;
        debug.enabled = exports.enabled(namespace);
        debug.useColors = exports.useColors();
        debug.color = selectColor(namespace);

        // env-specific initialization logic for debug instances
        if ('function' === typeof exports.init) {
          exports.init(debug);
        }

        return debug;
      }

      /**
       * Enables a debug mode by namespaces. This can include modes
       * separated by a colon and wildcards.
       *
       * @param {String} namespaces
       * @api public
       */

      function enable(namespaces) {
        exports.save(namespaces);

        exports.names = [];
        exports.skips = [];

        var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
        var len = split.length;

        for (var i = 0; i < len; i++) {
          if (!split[i]) continue; // ignore empty strings
          namespaces = split[i].replace(/\*/g, '.*?');
          if (namespaces[0] === '-') {
            exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
          } else {
            exports.names.push(new RegExp('^' + namespaces + '$'));
          }
        }
      }

      /**
       * Disable debug output.
       *
       * @api public
       */

      function disable() {
        exports.enable('');
      }

      /**
       * Returns true if the given mode name is enabled, false otherwise.
       *
       * @param {String} name
       * @return {Boolean}
       * @api public
       */

      function enabled(name) {
        var i, len;
        for (i = 0, len = exports.skips.length; i < len; i++) {
          if (exports.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = exports.names.length; i < len; i++) {
          if (exports.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }

      /**
       * Coerce `val`.
       *
       * @param {Mixed} val
       * @return {Mixed}
       * @api private
       */

      function coerce(val) {
        if (val instanceof Error) return val.stack || val.message;
        return val;
      }
    }, { "ms": 58 }], 56: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }, {}], 57: [function (require, module, exports) {
      (function (global) {
        /*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
        ;(function () {
          // Detect the `define` function exposed by asynchronous module loaders. The
          // strict `define` check is necessary for compatibility with `r.js`.
          var isLoader = typeof define === "function" && define.amd;

          // A set of types used to distinguish objects from primitives.
          var objectTypes = {
            "function": true,
            "object": true
          };

          // Detect the `exports` object exposed by CommonJS implementations.
          var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

          // Use the `global` object exposed by Node (including Browserify via
          // `insert-module-globals`), Narwhal, and Ringo as the default context,
          // and the `window` object in browsers. Rhino exports a `global` function
          // instead.
          var root = objectTypes[typeof window] && window || this,
              freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

          if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
            root = freeGlobal;
          }

          // Public: Initializes JSON 3 using the given `context` object, attaching the
          // `stringify` and `parse` functions to the specified `exports` object.
          function runInContext(context, exports) {
            context || (context = root["Object"]());
            exports || (exports = root["Object"]());

            // Native constructor aliases.
            var Number = context["Number"] || root["Number"],
                String = context["String"] || root["String"],
                Object = context["Object"] || root["Object"],
                Date = context["Date"] || root["Date"],
                SyntaxError = context["SyntaxError"] || root["SyntaxError"],
                TypeError = context["TypeError"] || root["TypeError"],
                Math = context["Math"] || root["Math"],
                nativeJSON = context["JSON"] || root["JSON"];

            // Delegate to the native `stringify` and `parse` implementations.
            if (typeof nativeJSON == "object" && nativeJSON) {
              exports.stringify = nativeJSON.stringify;
              exports.parse = nativeJSON.parse;
            }

            // Convenience aliases.
            var objectProto = Object.prototype,
                getClass = objectProto.toString,
                isProperty,
                forEach,
                undef;

            // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
            var isExtended = new Date(-3509827334573292);
            try {
              // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
              // results for certain dates in Opera >= 10.53.
              isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
              // Safari < 2.0.2 stores the internal millisecond time value correctly,
              // but clips the values returned by the date methods to the range of
              // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
              isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
            } catch (exception) {}

            // Internal: Determines whether the native `JSON.stringify` and `parse`
            // implementations are spec-compliant. Based on work by Ken Snyder.
            function has(name) {
              if (has[name] !== undef) {
                // Return cached feature test result.
                return has[name];
              }
              var isSupported;
              if (name == "bug-string-char-index") {
                // IE <= 7 doesn't support accessing string characters using square
                // bracket notation. IE 8 only supports this for primitives.
                isSupported = "a"[0] != "a";
              } else if (name == "json") {
                // Indicates whether both `JSON.stringify` and `JSON.parse` are
                // supported.
                isSupported = has("json-stringify") && has("json-parse");
              } else {
                var value,
                    serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                // Test `JSON.stringify`.
                if (name == "json-stringify") {
                  var stringify = exports.stringify,
                      stringifySupported = typeof stringify == "function" && isExtended;
                  if (stringifySupported) {
                    // A test function object with a custom `toJSON` method.
                    (value = function () {
                      return 1;
                    }).toJSON = value;
                    try {
                      stringifySupported =
                      // Firefox 3.1b1 and b2 serialize string, number, and boolean
                      // primitives as object literals.
                      stringify(0) === "0" &&
                      // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                      // literals.
                      stringify(new Number()) === "0" && stringify(new String()) == '""' &&
                      // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                      // does not define a canonical JSON representation (this applies to
                      // objects with `toJSON` properties as well, *unless* they are nested
                      // within an object or array).
                      stringify(getClass) === undef &&
                      // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                      // FF 3.1b3 pass this test.
                      stringify(undef) === undef &&
                      // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                      // respectively, if the value is omitted entirely.
                      stringify() === undef &&
                      // FF 3.1b1, 2 throw an error if the given value is not a number,
                      // string, array, object, Boolean, or `null` literal. This applies to
                      // objects with custom `toJSON` methods as well, unless they are nested
                      // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                      // methods entirely.
                      stringify(value) === "1" && stringify([value]) == "[1]" &&
                      // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                      // `"[null]"`.
                      stringify([undef]) == "[null]" &&
                      // YUI 3.0.0b1 fails to serialize `null` literals.
                      stringify(null) == "null" &&
                      // FF 3.1b1, 2 halts serialization if an array contains a function:
                      // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                      // elides non-JSON values from objects and arrays, unless they
                      // define custom `toJSON` methods.
                      stringify([undef, getClass, null]) == "[null,null,null]" &&
                      // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                      // where character escape codes are expected (e.g., `\b` => `\u0008`).
                      stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                      // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                      stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                      // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                      // serialize extended years.
                      stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                      // The milliseconds are optional in ES 5, but required in 5.1.
                      stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                      // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                      // four-digit years instead of six-digit years. Credits: @Yaffle.
                      stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                      // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                      // values less than 1000. Credits: @Yaffle.
                      stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                    } catch (exception) {
                      stringifySupported = false;
                    }
                  }
                  isSupported = stringifySupported;
                }
                // Test `JSON.parse`.
                if (name == "json-parse") {
                  var parse = exports.parse;
                  if (typeof parse == "function") {
                    try {
                      // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                      // Conforming implementations should also coerce the initial argument to
                      // a string prior to parsing.
                      if (parse("0") === 0 && !parse(false)) {
                        // Simple parsing test.
                        value = parse(serialized);
                        var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                        if (parseSupported) {
                          try {
                            // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                            parseSupported = !parse('"\t"');
                          } catch (exception) {}
                          if (parseSupported) {
                            try {
                              // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                              // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                              // certain octal literals.
                              parseSupported = parse("01") !== 1;
                            } catch (exception) {}
                          }
                          if (parseSupported) {
                            try {
                              // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                              // points. These environments, along with FF 3.1b1 and 2,
                              // also allow trailing commas in JSON objects and arrays.
                              parseSupported = parse("1.") !== 1;
                            } catch (exception) {}
                          }
                        }
                      }
                    } catch (exception) {
                      parseSupported = false;
                    }
                  }
                  isSupported = parseSupported;
                }
              }
              return has[name] = !!isSupported;
            }

            if (!has("json")) {
              // Common `[[Class]]` name aliases.
              var functionClass = "[object Function]",
                  dateClass = "[object Date]",
                  numberClass = "[object Number]",
                  stringClass = "[object String]",
                  arrayClass = "[object Array]",
                  booleanClass = "[object Boolean]";

              // Detect incomplete support for accessing string characters by index.
              var charIndexBuggy = has("bug-string-char-index");

              // Define additional utility methods if the `Date` methods are buggy.
              if (!isExtended) {
                var floor = Math.floor;
                // A mapping between the months of the year and the number of days between
                // January 1st and the first of the respective month.
                var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                // Internal: Calculates the number of days between the Unix epoch and the
                // first day of the given month.
                var getDay = function (year, month) {
                  return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                };
              }

              // Internal: Determines if a property is a direct property of the given
              // object. Delegates to the native `Object#hasOwnProperty` method.
              if (!(isProperty = objectProto.hasOwnProperty)) {
                isProperty = function (property) {
                  var members = {},
                      constructor;
                  if ((members.__proto__ = null, members.__proto__ = {
                    // The *proto* property cannot be set multiple times in recent
                    // versions of Firefox and SeaMonkey.
                    "toString": 1
                  }, members).toString != getClass) {
                    // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                    // supports the mutable *proto* property.
                    isProperty = function (property) {
                      // Capture and break the object's prototype chain (see section 8.6.2
                      // of the ES 5.1 spec). The parenthesized expression prevents an
                      // unsafe transformation by the Closure Compiler.
                      var original = this.__proto__,
                          result = property in (this.__proto__ = null, this);
                      // Restore the original prototype chain.
                      this.__proto__ = original;
                      return result;
                    };
                  } else {
                    // Capture a reference to the top-level `Object` constructor.
                    constructor = members.constructor;
                    // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                    // other environments.
                    isProperty = function (property) {
                      var parent = (this.constructor || constructor).prototype;
                      return property in this && !(property in parent && this[property] === parent[property]);
                    };
                  }
                  members = null;
                  return isProperty.call(this, property);
                };
              }

              // Internal: Normalizes the `for...in` iteration algorithm across
              // environments. Each enumerated key is yielded to a `callback` function.
              forEach = function (object, callback) {
                var size = 0,
                    Properties,
                    members,
                    property;

                // Tests for bugs in the current environment's `for...in` algorithm. The
                // `valueOf` property inherits the non-enumerable flag from
                // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
                (Properties = function () {
                  this.valueOf = 0;
                }).prototype.valueOf = 0;

                // Iterate over a new instance of the `Properties` class.
                members = new Properties();
                for (property in members) {
                  // Ignore all properties inherited from `Object.prototype`.
                  if (isProperty.call(members, property)) {
                    size++;
                  }
                }
                Properties = members = null;

                // Normalize the iteration algorithm.
                if (!size) {
                  // A list of non-enumerable properties inherited from `Object.prototype`.
                  members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                  // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
                  // properties.
                  forEach = function (object, callback) {
                    var isFunction = getClass.call(object) == functionClass,
                        property,
                        length;
                    var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
                    for (property in object) {
                      // Gecko <= 1.0 enumerates the `prototype` property of functions under
                      // certain conditions; IE does not.
                      if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                        callback(property);
                      }
                    }
                    // Manually invoke the callback for each non-enumerable property.
                    for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
                  };
                } else if (size == 2) {
                  // Safari <= 2.0.4 enumerates shadowed properties twice.
                  forEach = function (object, callback) {
                    // Create a set of iterated properties.
                    var members = {},
                        isFunction = getClass.call(object) == functionClass,
                        property;
                    for (property in object) {
                      // Store each property name to prevent double enumeration. The
                      // `prototype` property of functions is not enumerated due to cross-
                      // environment inconsistencies.
                      if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                        callback(property);
                      }
                    }
                  };
                } else {
                  // No bugs detected; use the standard `for...in` algorithm.
                  forEach = function (object, callback) {
                    var isFunction = getClass.call(object) == functionClass,
                        property,
                        isConstructor;
                    for (property in object) {
                      if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                        callback(property);
                      }
                    }
                    // Manually invoke the callback for the `constructor` property due to
                    // cross-environment inconsistencies.
                    if (isConstructor || isProperty.call(object, property = "constructor")) {
                      callback(property);
                    }
                  };
                }
                return forEach(object, callback);
              };

              // Public: Serializes a JavaScript `value` as a JSON string. The optional
              // `filter` argument may specify either a function that alters how object and
              // array members are serialized, or an array of strings and numbers that
              // indicates which properties should be serialized. The optional `width`
              // argument may be either a string or number that specifies the indentation
              // level of the output.
              if (!has("json-stringify")) {
                // Internal: A map of control characters and their escaped equivalents.
                var Escapes = {
                  92: "\\\\",
                  34: '\\"',
                  8: "\\b",
                  12: "\\f",
                  10: "\\n",
                  13: "\\r",
                  9: "\\t"
                };

                // Internal: Converts `value` into a zero-padded string such that its
                // length is at least equal to `width`. The `width` must be <= 6.
                var leadingZeroes = "000000";
                var toPaddedString = function (width, value) {
                  // The `|| 0` expression is necessary to work around a bug in
                  // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
                  return (leadingZeroes + (value || 0)).slice(-width);
                };

                // Internal: Double-quotes a string `value`, replacing all ASCII control
                // characters (characters with code unit values between 0 and 31) with
                // their escaped equivalents. This is an implementation of the
                // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
                var unicodePrefix = "\\u00";
                var quote = function (value) {
                  var result = '"',
                      index = 0,
                      length = value.length,
                      useCharIndex = !charIndexBuggy || length > 10;
                  var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
                  for (; index < length; index++) {
                    var charCode = value.charCodeAt(index);
                    // If the character is a control character, append its Unicode or
                    // shorthand escape sequence; otherwise, append the character as-is.
                    switch (charCode) {
                      case 8:case 9:case 10:case 12:case 13:case 34:case 92:
                        result += Escapes[charCode];
                        break;
                      default:
                        if (charCode < 32) {
                          result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                          break;
                        }
                        result += useCharIndex ? symbols[index] : value.charAt(index);
                    }
                  }
                  return result + '"';
                };

                // Internal: Recursively serializes an object. Implements the
                // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
                var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
                  var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                  try {
                    // Necessary for host object support.
                    value = object[property];
                  } catch (exception) {}
                  if (typeof value == "object" && value) {
                    className = getClass.call(value);
                    if (className == dateClass && !isProperty.call(value, "toJSON")) {
                      if (value > -1 / 0 && value < 1 / 0) {
                        // Dates are serialized according to the `Date#toJSON` method
                        // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                        // for the ISO 8601 date time string format.
                        if (getDay) {
                          // Manually compute the year, month, date, hours, minutes,
                          // seconds, and milliseconds if the `getUTC*` methods are
                          // buggy. Adapted from @Yaffle's `date-shim` project.
                          date = floor(value / 864e5);
                          for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                          for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                          date = 1 + date - getDay(year, month);
                          // The `time` value specifies the time within the day (see ES
                          // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                          // to compute `A modulo B`, as the `%` operator does not
                          // correspond to the `modulo` operation for negative numbers.
                          time = (value % 864e5 + 864e5) % 864e5;
                          // The hours, minutes, seconds, and milliseconds are obtained by
                          // decomposing the time within the day. See section 15.9.1.10.
                          hours = floor(time / 36e5) % 24;
                          minutes = floor(time / 6e4) % 60;
                          seconds = floor(time / 1e3) % 60;
                          milliseconds = time % 1e3;
                        } else {
                          year = value.getUTCFullYear();
                          month = value.getUTCMonth();
                          date = value.getUTCDate();
                          hours = value.getUTCHours();
                          minutes = value.getUTCMinutes();
                          seconds = value.getUTCSeconds();
                          milliseconds = value.getUTCMilliseconds();
                        }
                        // Serialize extended years correctly.
                        value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                        // Months, dates, hours, minutes, and seconds should have two
                        // digits; milliseconds should have three.
                        "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                        // Milliseconds are optional in ES 5.0, but required in 5.1.
                        "." + toPaddedString(3, milliseconds) + "Z";
                      } else {
                        value = null;
                      }
                    } else if (typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || isProperty.call(value, "toJSON"))) {
                      // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                      // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                      // ignores all `toJSON` methods on these objects unless they are
                      // defined directly on an instance.
                      value = value.toJSON(property);
                    }
                  }
                  if (callback) {
                    // If a replacement function was provided, call it to obtain the value
                    // for serialization.
                    value = callback.call(object, property, value);
                  }
                  if (value === null) {
                    return "null";
                  }
                  className = getClass.call(value);
                  if (className == booleanClass) {
                    // Booleans are represented literally.
                    return "" + value;
                  } else if (className == numberClass) {
                    // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                    // `"null"`.
                    return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                  } else if (className == stringClass) {
                    // Strings are double-quoted and escaped.
                    return quote("" + value);
                  }
                  // Recursively serialize objects and arrays.
                  if (typeof value == "object") {
                    // Check for cyclic structures. This is a linear search; performance
                    // is inversely proportional to the number of unique nested objects.
                    for (length = stack.length; length--;) {
                      if (stack[length] === value) {
                        // Cyclic structures cannot be serialized by `JSON.stringify`.
                        throw TypeError();
                      }
                    }
                    // Add the object to the stack of traversed objects.
                    stack.push(value);
                    results = [];
                    // Save the current indentation level and indent one additional level.
                    prefix = indentation;
                    indentation += whitespace;
                    if (className == arrayClass) {
                      // Recursively serialize array elements.
                      for (index = 0, length = value.length; index < length; index++) {
                        element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                        results.push(element === undef ? "null" : element);
                      }
                      result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
                    } else {
                      // Recursively serialize object members. Members are selected from
                      // either a user-specified list of property names, or the object
                      // itself.
                      forEach(properties || value, function (property) {
                        var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                        if (element !== undef) {
                          // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                          // is not the empty string, let `member` {quote(property) + ":"}
                          // be the concatenation of `member` and the `space` character."
                          // The "`space` character" refers to the literal space
                          // character, not the `space` {width} argument provided to
                          // `JSON.stringify`.
                          results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                        }
                      });
                      result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
                    }
                    // Remove the object from the traversed object stack.
                    stack.pop();
                    return result;
                  }
                };

                // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
                exports.stringify = function (source, filter, width) {
                  var whitespace, callback, properties, className;
                  if (objectTypes[typeof filter] && filter) {
                    if ((className = getClass.call(filter)) == functionClass) {
                      callback = filter;
                    } else if (className == arrayClass) {
                      // Convert the property names array into a makeshift set.
                      properties = {};
                      for (var index = 0, length = filter.length, value; index < length; value = filter[index++], (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1));
                    }
                  }
                  if (width) {
                    if ((className = getClass.call(width)) == numberClass) {
                      // Convert the `width` to an integer and create a string containing
                      // `width` number of space characters.
                      if ((width -= width % 1) > 0) {
                        for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                      }
                    } else if (className == stringClass) {
                      whitespace = width.length <= 10 ? width : width.slice(0, 10);
                    }
                  }
                  // Opera <= 7.54u2 discards the values associated with empty string keys
                  // (`""`) only if they are used directly within an object member list
                  // (e.g., `!("" in { "": 1})`).
                  return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                };
              }

              // Public: Parses a JSON source string.
              if (!has("json-parse")) {
                var fromCharCode = String.fromCharCode;

                // Internal: A map of escaped control characters and their unescaped
                // equivalents.
                var Unescapes = {
                  92: "\\",
                  34: '"',
                  47: "/",
                  98: "\b",
                  116: "\t",
                  110: "\n",
                  102: "\f",
                  114: "\r"
                };

                // Internal: Stores the parser state.
                var Index, Source;

                // Internal: Resets the parser state and throws a `SyntaxError`.
                var abort = function () {
                  Index = Source = null;
                  throw SyntaxError();
                };

                // Internal: Returns the next token, or `"$"` if the parser has reached
                // the end of the source string. A token may be a string, number, `null`
                // literal, or Boolean literal.
                var lex = function () {
                  var source = Source,
                      length = source.length,
                      value,
                      begin,
                      position,
                      isSigned,
                      charCode;
                  while (Index < length) {
                    charCode = source.charCodeAt(Index);
                    switch (charCode) {
                      case 9:case 10:case 13:case 32:
                        // Skip whitespace tokens, including tabs, carriage returns, line
                        // feeds, and space characters.
                        Index++;
                        break;
                      case 123:case 125:case 91:case 93:case 58:case 44:
                        // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                        // the current position.
                        value = charIndexBuggy ? source.charAt(Index) : source[Index];
                        Index++;
                        return value;
                      case 34:
                        // `"` delimits a JSON string; advance to the next character and
                        // begin parsing the string. String tokens are prefixed with the
                        // sentinel `@` character to distinguish them from punctuators and
                        // end-of-string tokens.
                        for (value = "@", Index++; Index < length;) {
                          charCode = source.charCodeAt(Index);
                          if (charCode < 32) {
                            // Unescaped ASCII control characters (those with a code unit
                            // less than the space character) are not permitted.
                            abort();
                          } else if (charCode == 92) {
                            // A reverse solidus (`\`) marks the beginning of an escaped
                            // control character (including `"`, `\`, and `/`) or Unicode
                            // escape sequence.
                            charCode = source.charCodeAt(++Index);
                            switch (charCode) {
                              case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                                // Revive escaped control characters.
                                value += Unescapes[charCode];
                                Index++;
                                break;
                              case 117:
                                // `\u` marks the beginning of a Unicode escape sequence.
                                // Advance to the first character and validate the
                                // four-digit code point.
                                begin = ++Index;
                                for (position = Index + 4; Index < position; Index++) {
                                  charCode = source.charCodeAt(Index);
                                  // A valid sequence comprises four hexdigits (case-
                                  // insensitive) that form a single hexadecimal value.
                                  if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                    // Invalid Unicode escape sequence.
                                    abort();
                                  }
                                }
                                // Revive the escaped character.
                                value += fromCharCode("0x" + source.slice(begin, Index));
                                break;
                              default:
                                // Invalid escape sequence.
                                abort();
                            }
                          } else {
                            if (charCode == 34) {
                              // An unescaped double-quote character marks the end of the
                              // string.
                              break;
                            }
                            charCode = source.charCodeAt(Index);
                            begin = Index;
                            // Optimize for the common case where a string is valid.
                            while (charCode >= 32 && charCode != 92 && charCode != 34) {
                              charCode = source.charCodeAt(++Index);
                            }
                            // Append the string as-is.
                            value += source.slice(begin, Index);
                          }
                        }
                        if (source.charCodeAt(Index) == 34) {
                          // Advance to the next character and return the revived string.
                          Index++;
                          return value;
                        }
                        // Unterminated string.
                        abort();
                      default:
                        // Parse numbers and literals.
                        begin = Index;
                        // Advance past the negative sign, if one is specified.
                        if (charCode == 45) {
                          isSigned = true;
                          charCode = source.charCodeAt(++Index);
                        }
                        // Parse an integer or floating-point value.
                        if (charCode >= 48 && charCode <= 57) {
                          // Leading zeroes are interpreted as octal literals.
                          if (charCode == 48 && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57)) {
                            // Illegal octal literal.
                            abort();
                          }
                          isSigned = false;
                          // Parse the integer component.
                          for (; Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++);
                          // Floats cannot contain a leading decimal point; however, this
                          // case is already accounted for by the parser.
                          if (source.charCodeAt(Index) == 46) {
                            position = ++Index;
                            // Parse the decimal component.
                            for (; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++);
                            if (position == Index) {
                              // Illegal trailing decimal.
                              abort();
                            }
                            Index = position;
                          }
                          // Parse exponents. The `e` denoting the exponent is
                          // case-insensitive.
                          charCode = source.charCodeAt(Index);
                          if (charCode == 101 || charCode == 69) {
                            charCode = source.charCodeAt(++Index);
                            // Skip past the sign following the exponent, if one is
                            // specified.
                            if (charCode == 43 || charCode == 45) {
                              Index++;
                            }
                            // Parse the exponential component.
                            for (position = Index; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++);
                            if (position == Index) {
                              // Illegal empty exponent.
                              abort();
                            }
                            Index = position;
                          }
                          // Coerce the parsed value to a JavaScript number.
                          return +source.slice(begin, Index);
                        }
                        // A negative sign may only precede numbers.
                        if (isSigned) {
                          abort();
                        }
                        // `true`, `false`, and `null` literals.
                        if (source.slice(Index, Index + 4) == "true") {
                          Index += 4;
                          return true;
                        } else if (source.slice(Index, Index + 5) == "false") {
                          Index += 5;
                          return false;
                        } else if (source.slice(Index, Index + 4) == "null") {
                          Index += 4;
                          return null;
                        }
                        // Unrecognized token.
                        abort();
                    }
                  }
                  // Return the sentinel `$` character if the parser has reached the end
                  // of the source string.
                  return "$";
                };

                // Internal: Parses a JSON `value` token.
                var get = function (value) {
                  var results, hasMembers;
                  if (value == "$") {
                    // Unexpected end of input.
                    abort();
                  }
                  if (typeof value == "string") {
                    if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                      // Remove the sentinel `@` character.
                      return value.slice(1);
                    }
                    // Parse object and array literals.
                    if (value == "[") {
                      // Parses a JSON array, returning a new JavaScript array.
                      results = [];
                      for (;; hasMembers || (hasMembers = true)) {
                        value = lex();
                        // A closing square bracket marks the end of the array literal.
                        if (value == "]") {
                          break;
                        }
                        // If the array literal contains elements, the current token
                        // should be a comma separating the previous element from the
                        // next.
                        if (hasMembers) {
                          if (value == ",") {
                            value = lex();
                            if (value == "]") {
                              // Unexpected trailing `,` in array literal.
                              abort();
                            }
                          } else {
                            // A `,` must separate each array element.
                            abort();
                          }
                        }
                        // Elisions and leading commas are not permitted.
                        if (value == ",") {
                          abort();
                        }
                        results.push(get(value));
                      }
                      return results;
                    } else if (value == "{") {
                      // Parses a JSON object, returning a new JavaScript object.
                      results = {};
                      for (;; hasMembers || (hasMembers = true)) {
                        value = lex();
                        // A closing curly brace marks the end of the object literal.
                        if (value == "}") {
                          break;
                        }
                        // If the object literal contains members, the current token
                        // should be a comma separator.
                        if (hasMembers) {
                          if (value == ",") {
                            value = lex();
                            if (value == "}") {
                              // Unexpected trailing `,` in object literal.
                              abort();
                            }
                          } else {
                            // A `,` must separate each object member.
                            abort();
                          }
                        }
                        // Leading commas are not permitted, object property names must be
                        // double-quoted strings, and a `:` must separate each property
                        // name and value.
                        if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                          abort();
                        }
                        results[value.slice(1)] = get(lex());
                      }
                      return results;
                    }
                    // Unexpected token encountered.
                    abort();
                  }
                  return value;
                };

                // Internal: Updates a traversed object member.
                var update = function (source, property, callback) {
                  var element = walk(source, property, callback);
                  if (element === undef) {
                    delete source[property];
                  } else {
                    source[property] = element;
                  }
                };

                // Internal: Recursively traverses a parsed JSON object, invoking the
                // `callback` function for each value. This is an implementation of the
                // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
                var walk = function (source, property, callback) {
                  var value = source[property],
                      length;
                  if (typeof value == "object" && value) {
                    // `forEach` can't be used to traverse an array in Opera <= 8.54
                    // because its `Object#hasOwnProperty` implementation returns `false`
                    // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                    if (getClass.call(value) == arrayClass) {
                      for (length = value.length; length--;) {
                        update(value, length, callback);
                      }
                    } else {
                      forEach(value, function (property) {
                        update(value, property, callback);
                      });
                    }
                  }
                  return callback.call(source, property, value);
                };

                // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
                exports.parse = function (source, callback) {
                  var result, value;
                  Index = 0;
                  Source = "" + source;
                  result = get(lex());
                  // If a JSON string contains multiple tokens, it is invalid.
                  if (lex() != "$") {
                    abort();
                  }
                  // Reset the parser state.
                  Index = Source = null;
                  return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
                };
              }
            }

            exports["runInContext"] = runInContext;
            return exports;
          }

          if (freeExports && !isLoader) {
            // Export for CommonJS environments.
            runInContext(root, freeExports);
          } else {
            // Export for web browsers and JavaScript engines.
            var nativeJSON = root.JSON,
                previousJSON = root["JSON3"],
                isRestored = false;

            var JSON3 = runInContext(root, root["JSON3"] = {
              // Public: Restores the original value of the global `JSON` object and
              // returns a reference to the `JSON3` object.
              "noConflict": function () {
                if (!isRestored) {
                  isRestored = true;
                  root.JSON = nativeJSON;
                  root["JSON3"] = previousJSON;
                  nativeJSON = previousJSON = null;
                }
                return JSON3;
              }
            });

            root.JSON = {
              "parse": JSON3.parse,
              "stringify": JSON3.stringify
            };
          }

          // Export for asynchronous module loaders.
          if (isLoader) {
            define(function () {
              return JSON3;
            });
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 58: [function (require, module, exports) {
      /**
       * Helpers.
       */

      var s = 1000;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var y = d * 365.25;

      /**
       * Parse or format the given `val`.
       *
       * Options:
       *
       *  - `long` verbose formatting [false]
       *
       * @param {String|Number} val
       * @param {Object} [options]
       * @throws {Error} throw an error if val is not a non-empty string or a number
       * @return {String|Number}
       * @api public
       */

      module.exports = function (val, options) {
        options = options || {};
        var type = typeof val;
        if (type === 'string' && val.length > 0) {
          return parse(val);
        } else if (type === 'number' && isNaN(val) === false) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
      };

      /**
       * Parse the given `str` and return milliseconds.
       *
       * @param {String} str
       * @return {Number}
       * @api private
       */

      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || 'ms').toLowerCase();
        switch (type) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return n * y;
          case 'days':
          case 'day':
          case 'd':
            return n * d;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return n * h;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return n * m;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return n * s;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return n;
          default:
            return undefined;
        }
      }

      /**
       * Short format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtShort(ms) {
        if (ms >= d) {
          return Math.round(ms / d) + 'd';
        }
        if (ms >= h) {
          return Math.round(ms / h) + 'h';
        }
        if (ms >= m) {
          return Math.round(ms / m) + 'm';
        }
        if (ms >= s) {
          return Math.round(ms / s) + 's';
        }
        return ms + 'ms';
      }

      /**
       * Long format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtLong(ms) {
        return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
      }

      /**
       * Pluralization helper.
       */

      function plural(ms, n, name) {
        if (ms < n) {
          return;
        }
        if (ms < n * 1.5) {
          return Math.floor(ms / n) + ' ' + name;
        }
        return Math.ceil(ms / n) + ' ' + name + 's';
      }
    }, {}], 59: [function (require, module, exports) {
      'use strict';

      var has = Object.prototype.hasOwnProperty;

      /**
       * Decode a URI encoded string.
       *
       * @param {String} input The URI encoded string.
       * @returns {String} The decoded string.
       * @api private
       */
      function decode(input) {
        return decodeURIComponent(input.replace(/\+/g, ' '));
      }

      /**
       * Simple query string parser.
       *
       * @param {String} query The query string that needs to be parsed.
       * @returns {Object}
       * @api public
       */
      function querystring(query) {
        var parser = /([^=?&]+)=?([^&]*)/g,
            result = {},
            part;

        while (part = parser.exec(query)) {
          var key = decode(part[1]),
              value = decode(part[2]);

          //
          // Prevent overriding of existing properties. This ensures that build-in
          // methods like `toString` or __proto__ are not overriden by malicious
          // querystrings.
          //
          if (key in result) continue;
          result[key] = value;
        }

        return result;
      }

      /**
       * Transform a query string to an object.
       *
       * @param {Object} obj Object that should be transformed.
       * @param {String} prefix Optional prefix.
       * @returns {String}
       * @api public
       */
      function querystringify(obj, prefix) {
        prefix = prefix || '';

        var pairs = [];

        //
        // Optionally prefix with a '?' if needed
        //
        if ('string' !== typeof prefix) prefix = '?';

        for (var key in obj) {
          if (has.call(obj, key)) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
          }
        }

        return pairs.length ? prefix + pairs.join('&') : '';
      }

      //
      // Expose the module.
      //
      exports.stringify = querystringify;
      exports.parse = querystring;
    }, {}], 60: [function (require, module, exports) {
      'use strict';

      /**
       * Check if we're required to add a port number.
       *
       * @see https://url.spec.whatwg.org/#default-port
       * @param {Number|String} port Port number we need to check
       * @param {String} protocol Protocol we need to check against.
       * @returns {Boolean} Is it a default port for the given protocol
       * @api private
       */

      module.exports = function required(port, protocol) {
        protocol = protocol.split(':')[0];
        port = +port;

        if (!port) return false;

        switch (protocol) {
          case 'http':
          case 'ws':
            return port !== 80;

          case 'https':
          case 'wss':
            return port !== 443;

          case 'ftp':
            return port !== 21;

          case 'gopher':
            return port !== 70;

          case 'file':
            return false;
        }

        return port !== 0;
      };
    }, {}], 61: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var required = require('requires-port'),
            qs = require('querystringify'),
            protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
            slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

        /**
         * These are the parse rules for the URL parser, it informs the parser
         * about:
         *
         * 0. The char it Needs to parse, if it's a string it should be done using
         *    indexOf, RegExp using exec and NaN means set as current value.
         * 1. The property we should set when parsing this value.
         * 2. Indication if it's backwards or forward parsing, when set as number it's
         *    the value of extra chars that should be split off.
         * 3. Inherit from location if non existing in the parser.
         * 4. `toLowerCase` the resulting value.
         */
        var rules = [['#', 'hash'], // Extract from the back.
        ['?', 'query'], // Extract from the back.
        ['/', 'pathname'], // Extract from the back.
        ['@', 'auth', 1], // Extract from the front.
        [NaN, 'host', undefined, 1, 1], // Set left over value.
        [/:(\d+)$/, 'port', undefined, 1], // RegExp the back.
        [NaN, 'hostname', undefined, 1, 1] // Set left over.
        ];

        /**
         * These properties should not be copied or inherited from. This is only needed
         * for all non blob URL's as a blob URL does not include a hash, only the
         * origin.
         *
         * @type {Object}
         * @private
         */
        var ignore = { hash: 1, query: 1 };

        /**
         * The location object differs when your code is loaded through a normal page,
         * Worker or through a worker using a blob. And with the blobble begins the
         * trouble as the location object will contain the URL of the blob, not the
         * location of the page where our code is loaded in. The actual origin is
         * encoded in the `pathname` so we can thankfully generate a good "default"
         * location from it so we can generate proper relative URL's again.
         *
         * @param {Object|String} loc Optional default location object.
         * @returns {Object} lolcation object.
         * @api public
         */
        function lolcation(loc) {
          loc = loc || global.location || {};

          var finaldestination = {},
              type = typeof loc,
              key;

          if ('blob:' === loc.protocol) {
            finaldestination = new URL(unescape(loc.pathname), {});
          } else if ('string' === type) {
            finaldestination = new URL(loc, {});
            for (key in ignore) delete finaldestination[key];
          } else if ('object' === type) {
            for (key in loc) {
              if (key in ignore) continue;
              finaldestination[key] = loc[key];
            }

            if (finaldestination.slashes === undefined) {
              finaldestination.slashes = slashes.test(loc.href);
            }
          }

          return finaldestination;
        }

        /**
         * @typedef ProtocolExtract
         * @type Object
         * @property {String} protocol Protocol matched in the URL, in lowercase.
         * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
         * @property {String} rest Rest of the URL that is not part of the protocol.
         */

        /**
         * Extract protocol information from a URL with/without double slash ("//").
         *
         * @param {String} address URL we want to extract from.
         * @return {ProtocolExtract} Extracted information.
         * @api private
         */
        function extractProtocol(address) {
          var match = protocolre.exec(address);

          return {
            protocol: match[1] ? match[1].toLowerCase() : '',
            slashes: !!match[2],
            rest: match[3]
          };
        }

        /**
         * Resolve a relative URL pathname against a base URL pathname.
         *
         * @param {String} relative Pathname of the relative URL.
         * @param {String} base Pathname of the base URL.
         * @return {String} Resolved pathname.
         * @api private
         */
        function resolve(relative, base) {
          var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
              i = path.length,
              last = path[i - 1],
              unshift = false,
              up = 0;

          while (i--) {
            if (path[i] === '.') {
              path.splice(i, 1);
            } else if (path[i] === '..') {
              path.splice(i, 1);
              up++;
            } else if (up) {
              if (i === 0) unshift = true;
              path.splice(i, 1);
              up--;
            }
          }

          if (unshift) path.unshift('');
          if (last === '.' || last === '..') path.push('');

          return path.join('/');
        }

        /**
         * The actual URL instance. Instead of returning an object we've opted-in to
         * create an actual constructor as it's much more memory efficient and
         * faster and it pleases my OCD.
         *
         * @constructor
         * @param {String} address URL we want to parse.
         * @param {Object|String} location Location defaults for relative paths.
         * @param {Boolean|Function} parser Parser for the query string.
         * @api public
         */
        function URL(address, location, parser) {
          if (!(this instanceof URL)) {
            return new URL(address, location, parser);
          }

          var relative,
              extracted,
              parse,
              instruction,
              index,
              key,
              instructions = rules.slice(),
              type = typeof location,
              url = this,
              i = 0;

          //
          // The following if statements allows this module two have compatibility with
          // 2 different API:
          //
          // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
          //    where the boolean indicates that the query string should also be parsed.
          //
          // 2. The `URL` interface of the browser which accepts a URL, object as
          //    arguments. The supplied object will be used as default values / fall-back
          //    for relative paths.
          //
          if ('object' !== type && 'string' !== type) {
            parser = location;
            location = null;
          }

          if (parser && 'function' !== typeof parser) parser = qs.parse;

          location = lolcation(location);

          //
          // Extract protocol information before running the instructions.
          //
          extracted = extractProtocol(address || '');
          relative = !extracted.protocol && !extracted.slashes;
          url.slashes = extracted.slashes || relative && location.slashes;
          url.protocol = extracted.protocol || location.protocol || '';
          address = extracted.rest;

          //
          // When the authority component is absent the URL starts with a path
          // component.
          //
          if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

          for (; i < instructions.length; i++) {
            instruction = instructions[i];
            parse = instruction[0];
            key = instruction[1];

            if (parse !== parse) {
              url[key] = address;
            } else if ('string' === typeof parse) {
              if (~(index = address.indexOf(parse))) {
                if ('number' === typeof instruction[2]) {
                  url[key] = address.slice(0, index);
                  address = address.slice(index + instruction[2]);
                } else {
                  url[key] = address.slice(index);
                  address = address.slice(0, index);
                }
              }
            } else if (index = parse.exec(address)) {
              url[key] = index[1];
              address = address.slice(0, index.index);
            }

            url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

            //
            // Hostname, host and protocol should be lowercased so they can be used to
            // create a proper `origin`.
            //
            if (instruction[4]) url[key] = url[key].toLowerCase();
          }

          //
          // Also parse the supplied query string in to an object. If we're supplied
          // with a custom parser as function use that instead of the default build-in
          // parser.
          //
          if (parser) url.query = parser(url.query);

          //
          // If the URL is relative, resolve the pathname against the base URL.
          //
          if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
            url.pathname = resolve(url.pathname, location.pathname);
          }

          //
          // We should not add port numbers if they are already the default port number
          // for a given protocol. As the host also contains the port number we're going
          // override it with the hostname which contains no port number.
          //
          if (!required(url.port, url.protocol)) {
            url.host = url.hostname;
            url.port = '';
          }

          //
          // Parse down the `auth` for the username and password.
          //
          url.username = url.password = '';
          if (url.auth) {
            instruction = url.auth.split(':');
            url.username = instruction[0] || '';
            url.password = instruction[1] || '';
          }

          url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

          //
          // The href is just the compiled result.
          //
          url.href = url.toString();
        }

        /**
         * This is convenience method for changing properties in the URL instance to
         * insure that they all propagate correctly.
         *
         * @param {String} part          Property we need to adjust.
         * @param {Mixed} value          The newly assigned value.
         * @param {Boolean|Function} fn  When setting the query, it will be the function
         *                               used to parse the query.
         *                               When setting the protocol, double slash will be
         *                               removed from the final url if it is true.
         * @returns {URL}
         * @api public
         */
        function set(part, value, fn) {
          var url = this;

          switch (part) {
            case 'query':
              if ('string' === typeof value && value.length) {
                value = (fn || qs.parse)(value);
              }

              url[part] = value;
              break;

            case 'port':
              url[part] = value;

              if (!required(value, url.protocol)) {
                url.host = url.hostname;
                url[part] = '';
              } else if (value) {
                url.host = url.hostname + ':' + value;
              }

              break;

            case 'hostname':
              url[part] = value;

              if (url.port) value += ':' + url.port;
              url.host = value;
              break;

            case 'host':
              url[part] = value;

              if (/:\d+$/.test(value)) {
                value = value.split(':');
                url.port = value.pop();
                url.hostname = value.join(':');
              } else {
                url.hostname = value;
                url.port = '';
              }

              break;

            case 'protocol':
              url.protocol = value.toLowerCase();
              url.slashes = !fn;
              break;

            case 'pathname':
            case 'hash':
              if (value) {
                var char = part === 'pathname' ? '/' : '#';
                url[part] = value.charAt(0) !== char ? char + value : value;
              } else {
                url[part] = value;
              }
              break;

            default:
              url[part] = value;
          }

          for (var i = 0; i < rules.length; i++) {
            var ins = rules[i];

            if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
          }

          url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

          url.href = url.toString();

          return url;
        }

        /**
         * Transform the properties back in to a valid and full URL string.
         *
         * @param {Function} stringify Optional query stringify function.
         * @returns {String}
         * @api public
         */
        function toString(stringify) {
          if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

          var query,
              url = this,
              protocol = url.protocol;

          if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

          var result = protocol + (url.slashes ? '//' : '');

          if (url.username) {
            result += url.username;
            if (url.password) result += ':' + url.password;
            result += '@';
          }

          result += url.host + url.pathname;

          query = 'object' === typeof url.query ? stringify(url.query) : url.query;
          if (query) result += '?' !== query.charAt(0) ? '?' + query : query;

          if (url.hash) result += url.hash;

          return result;
        }

        URL.prototype = { set: set, toString: toString };

        //
        // Expose the URL parser and some additional properties that might be useful for
        // others or testing.
        //
        URL.extractProtocol = extractProtocol;
        URL.location = lolcation;
        URL.qs = qs;

        module.exports = URL;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "querystringify": 59, "requires-port": 60 }] }, {}, [1])(1);
});

//# sourceMappingURL=sockjs.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ansiRegex = __webpack_require__(19)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(27);
var util = __webpack_require__(35);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,


// Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,


// RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],


// RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),


// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),

// Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,

// protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
},
    querystring = __webpack_require__(30);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function (arg) {
    return typeof arg === 'string';
  },
  isObject: function (arg) {
    return typeof arg === 'object' && arg !== null;
  },
  isNull: function (arg) {
    return arg === null;
  },
  isNullOrUndefined: function (arg) {
    return arg == null;
  }
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).

var ansiHTML = __webpack_require__(18);
var Entities = __webpack_require__(23).AllHtmlEntities;

var entities = new Entities();

var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

function createOverlayIframe(onIframeLoad) {
  var iframe = document.createElement('iframe');
  iframe.id = 'webpack-dev-server-client-overlay';
  iframe.src = 'about:blank';
  iframe.style.position = 'fixed';
  iframe.style.left = 0;
  iframe.style.top = 0;
  iframe.style.right = 0;
  iframe.style.bottom = 0;
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = 9999999999;
  iframe.onload = onIframeLoad;
  return iframe;
}

function addOverlayDivTo(iframe) {
  var div = iframe.contentDocument.createElement('div');
  div.id = 'webpack-dev-server-client-overlay-div';
  div.style.position = 'fixed';
  div.style.boxSizing = 'border-box';
  div.style.left = 0;
  div.style.top = 0;
  div.style.right = 0;
  div.style.bottom = 0;
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  div.style.color = '#E8E8E8';
  div.style.fontFamily = 'Menlo, Consolas, monospace';
  div.style.fontSize = 'large';
  div.style.padding = '2rem';
  div.style.lineHeight = '1.2';
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflow = 'auto';
  iframe.contentDocument.body.appendChild(div);
  return div;
}

var overlayIframe = null;
var overlayDiv = null;
var lastOnOverlayDivReady = null;

function ensureOverlayDivExists(onOverlayDivReady) {
  if (overlayDiv) {
    // Everything is ready, call the callback right away.
    onOverlayDivReady(overlayDiv);
    return;
  }

  // Creating an iframe may be asynchronous so we'll schedule the callback.
  // In case of multiple calls, last callback wins.
  lastOnOverlayDivReady = onOverlayDivReady;

  if (overlayIframe) {
    // We're already creating it.
    return;
  }

  // Create iframe and, when it is ready, a div inside it.
  overlayIframe = createOverlayIframe(function () {
    overlayDiv = addOverlayDivTo(overlayIframe);
    // Now we can talk!
    lastOnOverlayDivReady(overlayDiv);
  });

  // Zalgo alert: onIframeLoad() will be called either synchronously
  // or asynchronously depending on the browser.
  // We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.
  document.body.appendChild(overlayIframe);
}

function showMessageOverlay(message) {
  ensureOverlayDivExists(function (div) {
    // Make it look similar to our terminal.
    div.innerHTML = '<span style="color: #' + colors.red + '">Failed to compile.</span><br><br>' + ansiHTML(entities.encode(message));
  });
}

function destroyErrorOverlay() {
  if (!overlayDiv) {
    // It is not there in the first place.
    return;
  }

  // Clean up and reset internal state.
  document.body.removeChild(overlayIframe);
  overlayDiv = null;
  overlayIframe = null;
  lastOnOverlayDivReady = null;
}

// Successful compilation.
exports.clear = function handleSuccess() {
  destroyErrorOverlay();
};

// Compilation with errors (e.g. syntax error or missing modules).
exports.showMessage = function handleMessage(messages) {
  showMessageOverlay(messages[0]);
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SockJS = __webpack_require__(31);

var retries = 0;
var sock = null;

var socket = function initSocket(url, handlers) {
  sock = new SockJS(url);

  sock.onopen = function onopen() {
    retries = 0;
  };

  sock.onclose = function onclose() {
    if (retries === 0) {
      handlers.close();
    }

    // Try to reconnect.
    sock = null;

    // After 10 retries stop trying, to prevent logspam.
    if (retries <= 10) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-mixed-operators, no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;

      setTimeout(function () {
        socket(url, handlers);
      }, retryInMs);
    }
  };

  sock.onmessage = function onmessage(e) {
    // This assumes that all data sent via the websocket is JSON.
    var msg = JSON.parse(e.data);
    if (handlers[msg.type]) {
      handlers[msg.type](msg.data);
    }
  };
};

module.exports = socket;

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function () {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function () {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(22);
module.exports = new EventEmitter();

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__watcher_js__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__grid_js__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__keyboard_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scene_js__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__camera_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__map_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__character_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__characters_player_js__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__characters_cactus_js__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__characters_oldWoman_js__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__characters_hedgehog_js__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__transport_balloon_js__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__sprite_js__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__prerender_js__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__collisionsDetector_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__engine_js__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__gamepad_js__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__timer_js__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__animation_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__animationsChain_js__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__tile_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__element_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__bullet_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__layer_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__cloud_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__cloudsSystem_js__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__sprites_json__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__sprites_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28__sprites_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__tiles_json__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__tiles_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_29__tiles_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__level_json__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__level_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_30__level_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__arrayToObject_js__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__elements_json__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__elements_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32__elements_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__defaultLayers_json__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__defaultLayers_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_33__defaultLayers_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__setData_js__ = __webpack_require__(57);






































class App {

  constructor() {
    this.settings = __WEBPACK_IMPORTED_MODULE_1__settings_js__["a" /* default */];
    this.watchers = [];
    this.timers = [];
    this.animationsChains = [];
    this.world = {};

    this.underControl = null;

    this.screen = {};

    this.screen.width = window.screen.width;
    this.screen.height = window.screen.height;
    this.screen.k = Math.max(window.screen.width, window.screen.height) / Math.min(window.screen.width, window.screen.height);

    this.settings.display.k = Math.max(this.settings.display.width, this.settings.display.height) / Math.min(this.settings.display.width, this.settings.display.height);

    this.images = {};
  }

  imagesInit() {
    let image = new Image();
    image.src = __WEBPACK_IMPORTED_MODULE_29__tiles_json___default.a.tiles.image;
    this.images.tiles = image;
  }

  fullScreen() {
    let elem = document.getElementById("ctx");

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    };

    this.settings.display.fullscreen = true;
    this.scene.resize();
  }

  init() {
    let that = this;

    this.grid = new __WEBPACK_IMPORTED_MODULE_2__grid_js__["a" /* default */](this);

    window.onresize = function () {
      if (that.settings.display.fullscreen === true) {
        that.scene.resize(window.innerWidth, window.innerHeight);
      };
    };

    this.imagesInit();

    this.engine = new __WEBPACK_IMPORTED_MODULE_17__engine_js__["a" /* default */](this);

    this.camera = new __WEBPACK_IMPORTED_MODULE_6__camera_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](0, 0), this);
    this.scene = new __WEBPACK_IMPORTED_MODULE_5__scene_js__["a" /* default */]('ctx', this.settings.display.width, this.settings.display.height, this);
    this.prerender = new __WEBPACK_IMPORTED_MODULE_15__prerender_js__["a" /* default */](this);

    this.player = new __WEBPACK_IMPORTED_MODULE_9__characters_player_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](100, 1300), this);
    // this.player = new Player(new Vector(3250, 520), this);
    this.playerSprite = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.player, this);

    this.player.addSprite(this.playerSprite);
    this.scene.addCamera(this.camera);

    this.underControl = this.player;

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_34__setData_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_30__level_json___default.a.data, this);

    let charactersLayer = new __WEBPACK_IMPORTED_MODULE_25__layer_js__["a" /* default */]('characters', 'characters', 7, null, 0, this);

    this.cactusSprite = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.cactus, this);
    this.cactus = new __WEBPACK_IMPORTED_MODULE_10__characters_cactus_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](330, 1400), this);
    this.cactus.addSprite(this.cactusSprite);
    this.scene.addCharacter(this.cactus);

    this.womanSprite = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.oldWoman, this);
    this.woman = new __WEBPACK_IMPORTED_MODULE_11__characters_oldWoman_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](1400, 1400), this);
    this.woman.addSprite(this.womanSprite);
    this.scene.addCharacter(this.woman);

    this.womanSprite2 = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.oldWoman, this);
    this.woman2 = new __WEBPACK_IMPORTED_MODULE_11__characters_oldWoman_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](2500, 1400), this);
    this.woman2.addSprite(this.womanSprite2);
    this.scene.addCharacter(this.woman2);

    this.womanSprite3 = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.oldWoman, this);
    this.woman3 = new __WEBPACK_IMPORTED_MODULE_11__characters_oldWoman_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](3200, 1300), this);
    this.woman3.addSprite(this.womanSprite3);
    this.scene.addCharacter(this.woman3);

    this.hedgehogSprite = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.hedgehog, this);
    this.hedgehog = new __WEBPACK_IMPORTED_MODULE_12__characters_hedgehog_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](1500, 1400), this);
    this.hedgehog.addSprite(this.hedgehogSprite);
    this.scene.addCharacter(this.hedgehog);

    this.hedgehogSprite2 = new __WEBPACK_IMPORTED_MODULE_14__sprite_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_28__sprites_json___default.a.hedgehog, this);
    this.hedgehog2 = new __WEBPACK_IMPORTED_MODULE_12__characters_hedgehog_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](1900, 1400), this);
    this.hedgehog2.addSprite(this.hedgehogSprite2);
    this.scene.addCharacter(this.hedgehog2);

    charactersLayer.add(this.player);
    charactersLayer.add(this.cactus);
    charactersLayer.add(this.woman);
    charactersLayer.add(this.woman2);
    charactersLayer.add(this.woman3);
    charactersLayer.add(this.hedgehog);
    charactersLayer.add(this.hedgehog2);

    let transportLayer = new __WEBPACK_IMPORTED_MODULE_25__layer_js__["a" /* default */]('transport', 'transport', 6, null, 0, this);

    let balloon = new __WEBPACK_IMPORTED_MODULE_13__transport_balloon_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_4__vector_js__["a" /* default */](1300, 1350), this);
    transportLayer.add(balloon);
    this.scene.addLayer(transportLayer);

    this.cloudsSystem = new __WEBPACK_IMPORTED_MODULE_27__cloudsSystem_js__["a" /* default */](this.scene, this);
    this.cloudsSystem.cloudGenerate();

    this.scene.addLayer(charactersLayer);
    this.scene.addCharacter(this.player);
    this.scene.camera.bindTo(this.player);

    let elementsInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_31__arrayToObject_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_32__elements_json___default.a, 'name');

    this.engine.start();
  }

  get(obj) {
    obj.animate = function (props, duration) {

      let animation = new __WEBPACK_IMPORTED_MODULE_20__animation_js__["a" /* default */](obj, props, duration, this);
      let chainsWithThisTarget = this.searchByProp(this.animationsChains, 'target', obj);

      if (chainsWithThisTarget[0] === undefined) {

        let animationsChain = new __WEBPACK_IMPORTED_MODULE_21__animationsChain_js__["a" /* default */](obj, this);
        animationsChain.add(animation);
        this.animationsChains.push(animationsChain);
      } else {
        chainsWithThisTarget[0].add(animation);
      };

      return obj;
    }.bind(this);

    obj.stop = function () {
      let chainsWithThisTarget = this.searchByProp(this.animationsChains, 'target', obj)[0];
      if (chainsWithThisTarget) {
        chainsWithThisTarget.delete();
      }
      return obj;
    }.bind(this);

    return obj;
  }

  checkAnimationsChains() {
    for (let chain in this.animationsChains) {
      this.animationsChains[chain].check();
    };
  }

  checkWatchers() {
    for (let watcher in this.watchers) {
      this.watchers[watcher].check();
    };
  }

  watch(obj, key, callback) {
    let watcher = new __WEBPACK_IMPORTED_MODULE_0__watcher_js__["a" /* default */](obj, key, callback);
    this.watchers.push(watcher);
  }

  timeout(func, delay) {
    let timer = new __WEBPACK_IMPORTED_MODULE_19__timer_js__["a" /* default */](func, delay, false, this);
    this.timers.push(timer);
    return timer;
  }

  interval(func, delay) {
    let timer = new __WEBPACK_IMPORTED_MODULE_19__timer_js__["a" /* default */](func, delay, true, this);
    this.timers.push(timer);
    return timer;
  }

  checkTimers() {
    for (let timer of this.timers) {
      timer.check();
    }
  }

  searchByProp(arr, key, val) {
    let result = [];

    for (let item in arr) {
      if (arr[item][key] === val) {
        result.push(arr[item]);
      }
    };

    return result;
  }

  rand_1(min, max) {
    return Math.random() * (max - min) + min;
  }

  rand_2(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  unique(arr) {
    if (!arr) {
      return;
    };

    let uniqueArr = [];
    for (let element of arr) {
      if (uniqueArr.indexOf(element) === -1) {
        uniqueArr.push(element);
      };
    };

    return uniqueArr;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Animation {

  constructor(target, props, duration, APP) {
    this.APP = APP;
    this.target = target;
    this.props = props;
    this.duration = duration;
    this.created = new Date();
    this.passed = null;
    this.timing = null;
    this.status = 'waiting';
  }

  init() {
    this.initialProps = {};
    this.differences = {};
    this.created = new Date();

    for (let prop in this.props) {
      this.initialProps[prop] = this.target[prop];
      this.differences[prop] = this.props[prop] - this.target[prop];
    };

    this.status = 'isInitialized';
  }

  check() {
    this.passed = new Date() - this.created;
    this.timing = this.passed / this.duration;

    if (this.passed > this.duration) {
      this.timing = 1;
      this.status = 'finished';
    };

    this.step();
  }

  delete() {
    let index = this.chain.animations.indexOf(this);
    this.chain.animations.splice(index, 1);
  }

  step() {
    for (let prop in this.props) {
      let differences = this.differences[prop] * this.timing;
      this.target[prop] = this.initialProps[prop] + this.differences[prop] * this.timing;
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Animation);

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class AnimationsChain {

  constructor(target, APP) {
    this.APP = APP;
    this.target = target;
    this.animations = [];
  }

  add(animation) {
    animation.chain = this;
    this.animations.push(animation);
  }

  check() {
    if (this.animations[0]) {

      if (this.animations[0].status === 'waiting') {
        this.animations[0].init();
        this.animations[0].check();
      } else if (this.animations[0].status === 'isInitialized') {
        this.animations[0].check();
      } else if (this.animations[0].status === 'finished') {
        this.animations[0].delete();
      }
    } else {

      this.delete();
    }
  }

  delete() {
    let index = this.APP.animationsChains.indexOf(this);
    this.APP.animationsChains.splice(index, 1);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (AnimationsChain);

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((array, key) => {
  let obj = {};

  for (let item of array) {
    let _key = item[key];
    obj[_key] = item;
  }

  return obj;
});

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bullet_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);




class Crutch extends __WEBPACK_IMPORTED_MODULE_0__bullet_js__["a" /* default */] {

  constructor(position, width, height, speed, shooter, APP) {
    super(position, width, height, speed, shooter, APP);
    this.image = new Image();
    this.image.src = './images/crutch.png';
    this.acceleration = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](0, 0.05);
    this.collisions = true;
    this.type = 'crutch';
  }

  update() {
    this.speed.plus(this.acceleration);
    this.position.plus(this.speed).fixed(0);
    this.checkCollisions();
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  checkCollisions() {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  }

  whenCollision(obj, side) {
    let reactions = {

      tile: {
        top: () => {
          this.delete();
        },

        right: () => {
          this.delete();
        },

        bottom: () => {
          this.delete();
        },

        left: () => {
          this.delete();
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      crutch: {
        top: () => {},

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      player: {
        top: () => {
          this.delete();
        },

        right: () => {
          this.delete();
        },

        bottom: () => {
          this.delete();
        },

        left: () => {
          this.delete();
        }
      }

    };

    if (reactions[obj]) {
      reactions[obj][side]();
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Crutch);

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);


class Camera {

  constructor(position = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](), APP) {
    this.APP = APP;
    this.position = position;
    this.oldPosition = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](0, 0);
    this.objBind = false;
    this.offsetX = (this.APP.settings.display.width - this.APP.settings.camera.deadZone.width) / 2 * -1, this.offsetY = -300;
    this.shakeOffset = {
      x: 0,
      y: 0
    };

    this.oldZoom = null;
    this.zoom = 1;

    this.zoomOffset = {
      x: 0,
      y: 0
    };

    this.oldZoomOffset = {
      x: 0,
      y: 0
    };

    this.translate = {
      x: 0,
      y: 0
    };

    this.scope = {};

    this.deadZone = {
      width: this.APP.settings.camera.deadZone.width,
      height: this.APP.settings.camera.deadZone.height,
      position: new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](0, 0)
    };
  }

  setPosition(position) {
    this.position = position;
  }

  shake() {

    let randomShake = () => {
      return this.APP.rand_1(-15, 15);
    };

    let randomTime = () => {
      return this.APP.rand_1(20, 70);
    };

    this.APP.get(this.shakeOffset).stop().animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake() }, randomTime()).animate({ x: 0, y: 0 }, 500);
  }

  getScope() {

    this.scope.x1 = this.position.x - 300;
    this.scope.y1 = this.position.y - 300;

    this.scope.x2 = this.position.x + this.APP.scene.width / this.zoom + 300;
    this.scope.y2 = this.position.y + this.APP.scene.height / this.zoom + 300;

    this.scope.width = this.scope.x2 - this.scope.x1;
    this.scope.height = this.scope.y2 - this.scope.y1;

    return this.scope;
  }

  deadZoneUpdate() {
    if (this.deadZone.position.x + this.deadZone.width < this.objBind.position.x + this.objBind.width) {
      this.deadZone.position.x = this.objBind.position.x - (this.deadZone.width - this.objBind.width);
      this.offsetAnimation('horizontal', -100, 12);
    };

    if (this.deadZone.position.x > this.objBind.position.x) {
      this.deadZone.position.x = this.objBind.position.x;
      this.offsetAnimation('horizontal', -700, 12);
    };

    if (this.deadZone.position.y > this.objBind.position.y) {
      this.deadZone.position.y = this.objBind.position.y;
      this.offsetAnimation('vertical', -300, 6);
    };

    if (this.deadZone.position.y + this.deadZone.height < this.objBind.position.y + this.objBind.height) {
      this.deadZone.position.y = this.objBind.position.y - (this.deadZone.height - this.objBind.height);
      this.offsetAnimation('vertical', 0, 6);
    };
  }

  update() {
    this.getScope();

    if (this.objBind !== false) {
      this.deadZoneUpdate();
    };

    this.position.x = this.deadZone.position.x + this.offsetX + this.shakeOffset.x;
    this.position.y = this.deadZone.position.y + this.offsetY + this.shakeOffset.y - 100;

    this.position.fixed();

    let translateX = this.position.x - this.oldPosition.x;
    let translateY = this.position.y - this.oldPosition.y;

    this.scene.ctx.translate(-translateX, -translateY);

    if (this.zoom !== this.oldZoom) {
      this.setZoom();
      this.oldZoom = this.zoom;
    };

    // this.translate.x += -translateX * this.zoom;
    // this.translate.y += -translateY * this.zoom;

    this.translate.x += translateX;
    this.translate.y += translateY;

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;
  }

  setZoom() {
    this.scene.ctx.translate(this.translate.x, this.translate.y);
    this.scene.ctx.scale(this.zoom / this.oldZoom, this.zoom / this.oldZoom);
    this.scene.ctx.translate(-this.translate.x, -this.translate.y);
  }

  bindTo(obj) {
    this.unbind();

    this.APP.get(this.deadZone.position).stop().animate({
      x: obj.position.x,
      y: obj.position.y
    }, 500);

    this.APP.get(this.deadZone).stop().animate({
      width: obj.deadZoneScale.width,
      height: obj.deadZoneScale.height
    }, 500);

    this.APP.timeout(() => {
      this.objBind = obj;
    }, 500);
  }

  unbind(obj) {
    this.objBind = false;
  }

  offsetAnimation(type, num, speed) {
    if (type === 'horizontal') {
      if (this.offsetX < num) {
        this.offsetX += speed;
      };

      if (this.offsetX > num) {
        this.offsetX -= speed;
      };
    } else if (type === 'vertical') {
      // if (this.offsetY < num) {
      //   this.offsetY += speed;
      // };

      // if (this.offsetY > num) {
      //   this.offsetY -= speed;
      // };
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Camera);

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__character_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_js__ = __webpack_require__(1);




class Cactus extends __WEBPACK_IMPORTED_MODULE_0__character_js__["a" /* default */] {

  constructor(position, APP) {
    super(position, APP);
    this.width = 45;
    this.height = 45;
    this.type = 'cactus';
    this.date = new Date();
    this.statusSwitcherTimeout = 2000;
    this.offset = {};
    this.eyesStatus = 'lookAtPlayer';
    this.eyes = [{
      position: new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](),
      width: 6,
      height: 6,
      offset: {
        x: 16,
        y: 12
      }
    }, {
      position: new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](),
      width: 6,
      height: 6,
      offset: {
        x: 24,
        y: 12
      }
    }];

    this.pupils = [{
      position: new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](this.eyes[0].position.x, this.eyes[0].position.y),
      width: 1,
      height: 1,
      offset: {
        x: 3,
        y: 2
      }
    }, {
      position: new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](this.eyes[1].position.x, this.eyes[1].position.y),
      width: 1,
      height: 1,
      offset: {
        x: 11,
        y: 2
      }
    }];
  }

  statusSwitcher() {
    let date = new Date();

    if (date - this.date > this.statusSwitcherTimeout) {

      if (this.eyesStatus === 'lookAtPlayer') {
        this.eyesStatus = false;
        this.APP.get(this.pupils[0].offset).stop().animate({ x: 3, y: 2 }, 500);
        this.APP.get(this.pupils[1].offset).stop().animate({ x: 11, y: 2 }, 500);
        this.statusSwitcherTimeout = this.APP.rand_1(300, 1200);
      } else {
        this.eyesStatus = 'lookAtPlayer';
        this.statusSwitcherTimeout = this.APP.rand_1(1500, 4000);
      }

      this.date = new Date();
    }
  }

  update() {
    super.update();
    this.checkCollisions();
    this.statusSwitcher();
    this.pupilsUpdate();

    if (this.eyesStatus === 'lookAtPlayer') {
      this.lookAtPlayer();
    };
  }

  damage() {
    let that = this;
    this.status.damage = true;
    this.APP.get(this.pupils[0].offset).stop().animate({ x: 3, y: 2 }, 500);
    this.APP.get(this.pupils[1].offset).stop().animate({ x: 11, y: 2 }, 500);

    this.APP.timeout(function () {
      that.status.damage = false;
    }, 700);
  }

  lookAtPlayer() {
    let player = this.APP.scene.player;

    if (player.center.y > this.eyes[0].position.y && player.center.y < this.eyes[0].position.y + this.eyes[0].height) {
      this.pupils[0].position.y = player.center.y;
      this.pupils[1].position.y = player.center.y;
    } else {
      if (player.center.y < this.eyes[0].position.y && this.eyes[0].position.y - player.center.y > 50) {
        this.pupils[0].position.y = this.eyes[0].position.y;
        this.pupils[1].position.y = this.eyes[1].position.y;
      } else if (player.center.y > this.eyes[0].position.y && player.center.y - this.eyes[0].position.y > 50) {
        this.pupils[0].position.y = this.eyes[0].position.y + this.eyes[0].height - 2;
        this.pupils[1].position.y = this.eyes[1].position.y + this.eyes[1].height - 2;
      }
    }

    if (player.center.x > this.eyes[0].position.x && player.center.x < this.eyes[0].position.x + this.eyes[0].width) {
      this.pupils[0].position.y = player.center.y;
      this.pupils[1].position.y = player.center.y;
    } else {
      if (player.center.x < this.eyes[0].position.x) {
        this.pupils[0].position.x = this.eyes[0].position.x;
        this.pupils[1].position.x = this.eyes[1].position.x;
      } else if (player.center.x > this.eyes[0].position.x) {
        this.pupils[0].position.x = this.eyes[0].position.x + this.eyes[0].width;
        this.pupils[1].position.x = this.eyes[1].position.x + this.eyes[1].width;
      }
    }
  }

  pupilsUpdate() {
    this.eyes[0].position.x = this.position.x + this.eyes[0].offset.x;
    this.eyes[0].position.y = this.position.y + this.eyes[0].offset.y;

    this.eyes[1].position.x = this.position.x + this.eyes[1].offset.x;
    this.eyes[1].position.y = this.position.y + this.eyes[1].offset.y;

    this.pupils[0].position.x = this.eyes[0].position.x + this.pupils[0].offset.x;
    this.pupils[0].position.y = this.eyes[0].position.y + this.pupils[0].offset.y;

    this.pupils[1].position.x = this.eyes[0].position.x + this.pupils[1].offset.x;
    this.pupils[1].position.y = this.eyes[0].position.y + this.pupils[1].offset.y;
  }

  setStatus() {
    if (this.status.damage) {
      if (this.status.direction === 'left') {
        this.status.animation = 'damageLeft';
      } else if (this.status.direction === 'right') {
        this.status.animation = 'damageRight';
      };

      return;
    };

    if (this.acceleration.x === 0 && this.speed.x < 0.5 && this.speed.x > -0.5) {

      if (this.status.direction === 'right') {
        this.status.animation = 'standRight';
      } else {
        this.status.animation = 'standLeft';
      };
    };
  }

  checkCollisions() {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  }

  whenCollision(obj, side) {
    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y + this.collisionStatus.with.height;
        },

        right: () => {
          this.speed.x = 0;
          this.position.x = this.collisionStatus.with.position.x - this.width - 1;
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;

          if (this.status.beforeJump !== true) {
            this.status.jump = false;
            this.status.damage = false;
          };

          this.position.y = this.collisionStatus.with.position.y - this.height;
        },

        left: () => {
          this.speed.x = 0;
          this.position.x = this.collisionStatus.with.position.x + this.collisionStatus.with.width + 1;
        }
      },

      player: {
        top: () => {
          this.damage();
        },

        right: () => {
          this.damage();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.damage();
        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {
          // ...
        },

        bottom: () => {
          // ...
        },

        left: () => {
          // ...
        }
      }

    };

    if (reactions[obj]) {
      reactions[obj][side]();
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Cactus);

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__character_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_js__ = __webpack_require__(1);




class Hedgehog extends __WEBPACK_IMPORTED_MODULE_0__character_js__["a" /* default */] {

  constructor(position, APP) {
    super(position, APP);
    this.width = 55;
    this.height = 35;
    this.type = 'hedgehog';
    this.date = new Date();
    this.statusSwitcherTimeout = 2000;
    this.offset = {};
    this.acceleration = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](-0.1, 0);
    this.maxSpeed = 1;
    this.isDead = false;
    this.lastShootTime = null;
    this.frequencyOfShots = 2000;

    this.mode = 'wait';

    this.status = {
      damage: false,
      direction: 'left',
      jump: false,
      onPlatform: false,
      run: 'wait',
      animation: null
    };
  }

  update() {

    this.checkCollisions();
    super.update();

    if (!this.status.animation) {
      this.status.animation = 'walkLeft';
    };

    if (this.nearbyHole === 'left') {
      this.status.direction = 'right';
      this.status.animation = 'walkRight';
      this.acceleration.x = 0.1;
    } else if (this.nearbyHole === 'right') {
      this.status.direction = 'left';

      this.status.animation = 'walkLeft';
      this.acceleration.x = -0.1;
    };
  }

  reverse() {

    if (this.collisionStatus.type === 'left') {
      this.status.direction = 'right';
      this.status.animation = 'walkRight';
      this.acceleration.x = 0.1;
      this.speed.x = 1;
    };

    if (this.collisionStatus.type === 'right') {
      this.status.direction = 'left';
      this.status.animation = 'walkLeft';
      this.acceleration.x = -0.1;
      this.speed.x = -1;
    };
  }

  checkCollisions() {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  }

  whenCollision(obj, side) {

    if (!obj) {
      return;
    };

    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y + this.collisionStatus.with.height;
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y - this.height;
        },

        left: () => {
          this.reverse();
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.reverse();
        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.reverse();
        }
      },

      player: {
        top: () => {},

        right: () => {
          // ...
        },

        bottom: () => {
          // ...
        },

        left: () => {
          // ...
        }
      },

      hedgehog: {
        top: () => {},

        right: () => {
          this.reverse();
        },

        bottom: () => {},

        left: () => {
          this.reverse();
        }
      }

    };

    if (!reactions[obj]) {
      return;
    };

    reactions[obj][side]();
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Hedgehog);

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__character_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bullets_Crutch_js__ = __webpack_require__(44);





class OldWoman extends __WEBPACK_IMPORTED_MODULE_0__character_js__["a" /* default */] {

  constructor(position, APP) {
    super(position, APP);
    this.width = 48;
    this.height = 48;
    this.type = 'oldWoman';
    this.date = new Date();
    this.statusSwitcherTimeout = 2000;
    this.offset = {};
    this.acceleration = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](-0.1, 0);
    this.maxSpeed = 1;
    this.isDead = false;
    this.lastShootTime = null;
    this.frequencyOfShots = 2000;

    this.mode = 'wait';

    this.status = {
      damage: false,
      direction: 'left',
      jump: false,
      onPlatform: false,
      run: 'wait',
      animation: null
    };
  }

  shoot(direction) {
    let that = this;

    if (this.timerBeforeShoot) {
      this.timerBeforeShoot.delete();
      this.timerBeforeShoot = null;
    };

    if (this.timerAfterShoot) {
      this.timerAfterShoot.delete();
      this.timerAfterShoot = null;
    };

    if (direction === 'left') {
      that.status.animation = 'shootLeft';
    } else if (direction === 'right') {
      that.status.animation = 'shootRight';
    };

    this.timerBeforeShoot = this.APP.timeout(function () {
      if (direction === 'left') {
        let bullet = new __WEBPACK_IMPORTED_MODULE_3__bullets_Crutch_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](that.position.x, that.position.y + 15), 23, 15, new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](-5, -1.5), that, that.APP);
      } else if (direction === 'right') {
        let bullet = new __WEBPACK_IMPORTED_MODULE_3__bullets_Crutch_js__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](that.position.x + 15, that.position.y + 15), 23, 15, new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](5, -1.5), that, that.APP);
      };
    }, 750);

    this.timerAfterShoot = this.APP.timeout(function () {
      if (direction === 'left') {
        that.status.animation = 'agressiveLeft';
      } else if (direction === 'right') {
        that.status.animation = 'agressiveRight';
      };
    }, 1500);
  }

  update() {
    if (!this.isDead) {
      this.checkCollisions();
      super.update();

      if (this.aggression) {

        if (this.mode !== 'aggressionMode') {
          this.setAggressionMode();
        } else {
          if (this.timerBeforeExitAgressionMode) {
            this.timerBeforeExitAgressionMode.delete();
            this.timerBeforeExitAgressionMode = null;
          };
        };
      } else if (this.mode !== 'wait' && !this.timerBeforeExitAgressionMode) {
        this.setWaitMode();
      };

      if (this.aggression) {
        this.status.direction = this.aggression;

        if (this.aggression === 'left' && this.status.animation !== 'shootLeft') {
          this.status.animation = 'agressiveLeft';
        } else if (this.aggression === 'right' && this.status.animation !== 'shootRight') {
          this.status.animation = 'agressiveRight';
        };

        if (new Date() - this.lastShootTime > this.frequencyOfShots) {
          this.lastShootTime = new Date();
          this.shoot(this.status.direction);
        }
      };

      if (!this.status.animation) {
        this.status.animation = 'walkLeft';
      };

      if (this.nearbyHole === 'left') {
        this.status.direction = 'right';
        this.status.animation = 'walkRight';
        this.acceleration.x = 0.1;
      } else if (this.nearbyHole === 'right') {
        this.status.direction = 'left';

        this.status.animation = 'walkLeft';
        this.acceleration.x = -0.1;
      };
    };
  }

  reverse() {
    if (this.collisionStatus.type === 'left') {
      this.status.direction = 'right';
      this.status.animation = 'walkRight';
      this.acceleration.x = 0.1;
    };

    if (this.collisionStatus.type === 'right') {
      this.status.direction = 'left';
      this.status.animation = 'walkLeft';
      this.acceleration.x = -0.1;
    };
  }

  setAggressionMode() {
    this.mode = 'aggressionMode';
    this.acceleration = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](0, 0);
    this.status.directionBeforeAggressive = this.status.direction;
  }

  setWaitMode() {
    if (this.isDead) {
      return;
    };

    let that = this;

    this.timerBeforeExitAgressionMode = this.APP.timeout(function () {
      that.mode = 'wait';
      that.status.direction = that.status.directionBeforeAggressive;

      if (that.status.direction === 'left') {
        that.acceleration = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](-0.1, 0);
        that.status.animation = 'walkLeft';
      } else if (that.status.direction === 'right') {
        that.acceleration = new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](0.1, 0);
        that.status.animation = 'walkRight';
      }
    }, 2000);
  }

  die() {
    if (this.timerBeforeShoot || this.timerAfterShoot) {
      this.timerBeforeShoot.delete();
      this.timerAfterShoot.delete();
      this.timerBeforeShoot = null;
      this.timerAfterShoot = null;
    };

    if (this.timerBeforeExitAgressionMode) {
      this.timerBeforeExitAgressionMode.delete();
      this.timerBeforeExitAgressionMode = null;
    };

    this.acceleration.x = 0;
    this.collisions = false;
    this.isDead = true;
    let that = this;
    this.APP.timeout(function () {

      if (that.status.direction === 'left') {
        that.status.animation = "dieLeft";
      } else if (that.status.direction === 'right') {
        that.status.animation = "dieRight";
      };
    }, 10);
  }

  checkCollisions() {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  }

  whenCollision(obj, side) {

    if (!obj) {
      return;
    };

    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y + this.collisionStatus.with.height;
        },

        right: () => {
          // this.speed.x = 0;
          // this.position.x = this.collisionStatus.with.position.x - this.width - 1;
          this.reverse();
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;

          if (this.status.beforeJump !== true) {
            this.status.jump = false;
            this.status.damage = false;
          };

          this.position.y = this.collisionStatus.with.position.y - this.height;
        },

        left: () => {
          // this.speed.x = 0;
          // this.position.x = this.collisionStatus.with.position.x + this.collisionStatus.with.width + 1;
          this.reverse();
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.reverse();
        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {
          if (this.aggression) {
            this.reverse();
          };
        },

        bottom: () => {
          // ...
        },

        left: () => {
          if (this.aggression) {
            this.reverse();
          };
        }
      },

      player: {
        top: () => {
          this.die();
        },

        right: () => {
          // ...
        },

        bottom: () => {
          // ...
        },

        left: () => {
          // ...
        }
      }

    };

    if (reactions[obj]) {
      reactions[obj][side]();
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (OldWoman);

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__character_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_js__ = __webpack_require__(1);




class Player extends __WEBPACK_IMPORTED_MODULE_0__character_js__["a" /* default */] {

  constructor(position, APP) {
    super(position, APP);
    this.type = 'player';
    this.maxSpeed = 4;
    this.defaultMaxSpeed = 4;
    this.nearbyTransport = null;
    this.transport = null;
    this.isInTransport = false;
    this.width = 16;
    this.height = 64;
    this.isGoingTo = null;
    this.deadZoneScale = {
      width: 200,
      height: 150
    };
  }

  control(pressedKeys, keyDown) {
    this.acceleration.x = 0;

    if (pressedKeys.indexOf('RIGHT') != -1 || pressedKeys.indexOf('D') != -1) {
      this.acceleration.x = 0.2;
    };

    if (pressedKeys.indexOf('LEFT') != -1 || pressedKeys.indexOf('A') != -1) {
      this.acceleration.x = -0.2;
    };

    if (keyDown === 'TOP' || pressedKeys.indexOf('W') != -1 || pressedKeys.indexOf('SPACE') != -1) {
      this.jump();
    };

    if (keyDown === 'CTRL') {};

    if (keyDown === 'ENTER') {
      if (!this.transport) {
        this.goToTransport();
      } else {
        this.transportOutput();
      }
    };
  }

  setStatus() {
    if (this.status.damage) {
      if (this.status.direction === 'left') {
        this.status.animation = 'damageLeft';
      } else if (this.status.direction === 'right') {
        this.status.animation = 'damageRight';
      };

      return;
    };

    if (this.speed.x > 0 && this.acceleration.x > 0) {
      this.status.direction = 'right';

      if (this.speed.x < 4) {
        this.status.animation = 'walkRight';
      } else {
        this.status.animation = 'runRight';
      };
    };

    if (this.speed.x < 0 && this.acceleration.x < 0) {
      this.status.direction = 'left';

      if (this.speed.x > -4) {
        this.status.animation = 'walkLeft';
      } else {
        this.status.animation = 'runLeft';
      };
    };

    if (this.speed.x > 0 && this.acceleration.x < 0) {
      this.status.animation = 'rightAndBrake';
    };

    if (this.speed.x < 0 && this.acceleration.x > 0) {
      this.status.animation = 'leftAndBrake';
    };

    if (this.speed.x > 0.5 && this.acceleration.x === 0) {
      this.status.animation = 'walkRight';
    };

    if (this.speed.x < -0.5 && this.acceleration.x === 0) {
      this.status.animation = 'walkLeft';
    };

    if (this.acceleration.x === 0 && this.speed.x < 0.5 && this.speed.x > -0.5) {

      if (this.status.direction === 'right') {
        this.status.animation = 'standRight';
      } else {
        this.status.animation = 'standLeft';
      };
    };

    if (this.status.jump === true) {
      if (this.status.direction === 'right') {
        this.status.animation = 'jumpRight';
      };

      if (this.status.direction === 'left') {
        this.status.animation = 'jumpLeft';
      }
    };

    if (this.status.jump === false && this.isOnPlatform === false && !this.isInTransport) {
      if (this.status.direction === 'right') {
        this.status.animation = 'jumpRight';
      };

      if (this.status.direction === 'left') {
        this.status.animation = 'jumpLeft';
      }
    };
  }

  goTo(target, speed, callback) {
    this.isGoingTo = {
      target: target,
      speed: speed,
      callback: callback
    };
  }

  goToTransport() {
    if (!this.nearbyTransport) {
      return;
    };

    this.transport = this.nearbyTransport;

    this.goTo(this.transport.input, 2, () => {
      this.isGoingTo = null;
      this.transportInput();
    });
  }

  goToUpdate() {
    if (this.isGoingTo) {
      let target = this.isGoingTo.target;
      this.maxSpeed = this.isGoingTo.speed;

      if (target.position.x - this.position.x > this.width / 2 + 1) {
        this.acceleration.x = 0.2;
      } else if (this.position.x - target.position.x > -(this.width / 2 - 1)) {
        this.acceleration.x = -0.2;
      } else {
        this.acceleration.x = 0;
        this.speed.x = 0;
        this.maxSpeed = this.defaultMaxSpeed;
        this.isGoingTo.callback();
      }
    };
  }

  transportInput() {

    if (!this.nearbyTransport) {
      return;
    };

    this.collisions = false;
    this.nearbyTransport = null;
    this.APP.camera.bindTo(this.transport);
    this.isInTransport = true;
    this.transport.driver = this;

    this.APP.underControl = this.transport;

    // this.APP.get(this.APP.camera).animate({offsetY: this.APP.camera.offsetY - 100}, 2000)
    this.APP.get(this.APP.scene.camera).stop().animate({
      zoom: this.transport.zoom
      // offsetX: this.APP.camera.offsetY - 200,
      // offsetY: this.APP.camera.offsetY - 300
    }, 500);
  }

  transportOutput() {
    if (!this.transport) {
      return;
    };

    this.collisions = true;
    this.APP.underControl = this;
    this.transport.driver = null;
    this.transport = null;
    this.APP.camera.bindTo(this);
    this.isInTransport = false;

    // this.APP.get(this.APP.scene.camera).animate({zoom: 1}, 2000)
    this.APP.get(this.APP.scene.camera).stop().animate({
      zoom: 1
      // offsetX: this.APP.camera.offsetY + 200,
      // offsetY: this.APP.camera.offsetY + 300
    }, 500);
  }

  checkCollisions() {
    if (this.currentCollisions.length !== 0) {
      for (let collision of this.currentCollisions) {
        this.whenCollision(collision);
      };
    };
  }

  whenCollision(collision) {

    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = collision.with.position.y + collision.with.height;
        },

        right: () => {
          this.speed.x = 0;
          this.position.x = collision.with.position.x - this.width - 1;
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;

          if (this.status.beforeJump !== true) {
            this.status.jump = false;
            this.status.damage = false;
          };

          this.position.y = collision.with.position.y - this.height;
        },

        left: () => {
          this.speed.x = 0;
          this.position.x = collision.with.position.x + collision.with.width + 1;
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {
          this.status.direction = 'right';
          this.damage();
        },

        bottom: () => {
          this.status.direction = 'left';
          this.damage();
        },

        left: () => {
          this.status.direction = 'left';
          this.damage();
        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {
          this.status.direction = 'right';
          this.damage();
        },

        bottom: () => {
          this.spring(10);
        },

        left: () => {
          this.status.direction = 'left';
          this.damage();
        }
      },

      crutch: {
        top: () => {
          this.damage();
        },

        right: () => {
          this.damage('right');
        },

        bottom: () => {
          this.damage();
        },

        left: () => {
          this.damage('left');
        }
      },

      hedgehog: {
        top: () => {
          this.damage();
        },

        right: () => {
          this.damage('right');
        },

        bottom: () => {
          this.damage();
        },

        left: () => {
          this.damage('left');
        }
      },

      balloon: {
        top: obj => {},

        right: obj => {},

        bottom: obj => {},

        left: obj => {},

        all: obj => {
          if (this.platform === obj.platform) {
            this.nearbyTransport = obj;
          };
        }
      }

    };

    if (reactions[collision.with.type]) {
      reactions[collision.with.type][collision.type](collision.with);
      if (reactions[collision.with.type]['all']) {
        reactions[collision.with.type]['all'](collision.with);
      }
    };
  }

  update() {
    this.nearbyTransport = null;
    this.checkCollisions();
    super.update();
    this.goToUpdate();
    if (this.isInTransport) {
      this.position.x = this.transport.driverPlace.position.x - this.width / 2;
      this.position.y = this.transport.driverPlace.position.y;
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__element_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__layer_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cloud_js__ = __webpack_require__(10);





class CloudsSystem {

  constructor(scene, APP) {
    this.scene = scene;
    this.APP = APP;
    this.cloudsLayer = new __WEBPACK_IMPORTED_MODULE_2__layer_js__["a" /* default */]('clouds', 'elements', 0, 'clouds', 0.8, this.APP);
    this.scene.addLayer(this.cloudsLayer);
    this.maxAmount = 700;
  }

  createCloud(position, speed, type) {
    let cloud = new __WEBPACK_IMPORTED_MODULE_3__cloud_js__["a" /* default */](position, speed, type, this.cloudsLayer, this.APP);
    this.cloudsLayer.add(cloud);
  }

  cloudGenerate(options) {

    let amount = options ? options.amount : this.maxAmount;
    for (let i = 0; i < amount; i++) {

      let randX, randY, randPosition, randType, randSpeedX;

      if (!options) {
        randX = this.APP.rand_2(-2000, this.APP.world.width * 8);
        randY = this.APP.rand_2(-2000, this.APP.world.height * 8);
        randPosition = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](randX, randY);
      } else {
        randX = this.APP.rand_2(options.minX, options.maxX);
        randY = this.APP.rand_2(options.minY, options.maxY);
        randPosition = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](randX, randY);
      };

      randSpeedX = this.APP.rand_1(-0.8, -0.2);
      randType = this.APP.rand_2(0, 5);

      this.createCloud(randPosition, new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */](randSpeedX, 0), randType, this.APP);
    };
  }

  update() {
    for (let cloud of this.cloudsLayer.items) {
      cloud.update();

      if (this.cloudsLayer.items.length < this.maxAmount) {
        this.cloudGenerate({
          amount: this.maxAmount - this.cloudsLayer.items.length,
          minX: this.APP.world.width * 8,
          minY: -1000,
          maxX: this.APP.world.width * 8 + 1000,
          maxY: this.APP.world.height * 8
        });
      };
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (CloudsSystem);

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__collisionsDetector_js__ = __webpack_require__(11);


class Engine {

  constructor(APP) {
    this.status = 'inactive';
    this.APP = APP;
  }

  tick() {
    this.APP.checkTimers();
    this.APP.checkAnimationsChains();
    this.APP.checkWatchers();
    this.APP.cloudsSystem.update();

    this.APP.scene.draw();

    let that = this;

    // for(let index in this.APP.scene.characters){
    //   this.APP.scene.characters[index].collisionStatus = null
    // };

    let dynamicObjects = [];
    dynamicObjects = dynamicObjects.concat(this.APP.scene.characters);
    dynamicObjects = dynamicObjects.concat(this.APP.scene.bullets);
    dynamicObjects = dynamicObjects.concat(this.APP.scene.transport);

    for (let dynamicObject of dynamicObjects) {
      dynamicObject.collisionStatus = null;
      dynamicObject.currentCollisions = [];
    };

    // collisionsDetector.detection(this.APP.scene.characters, this.APP.tilesMap.collisionsMap, function(obj_1, obj_2, type_2, type_1){

    __WEBPACK_IMPORTED_MODULE_0__collisionsDetector_js__["a" /* default */].detection(dynamicObjects, this.APP.tilesMap.collisionsMap, function (obj_1, obj_2, type_2, type_1) {
      if (type_1 === false && type_2 === false) {} else {
        if (obj_1.currentCollisions) {

          let unique_1 = true;

          for (let collision of obj_1.currentCollisions) {
            if (collision.with === obj_2) {
              unique_1 = false;
              break;
            };
          };

          if (unique_1) {
            obj_1.currentCollisions.push({
              with: obj_2,
              type: type_1
            });
          };
        };

        if (obj_2.currentCollisions) {

          let unique_2 = true;

          for (let collision of obj_2.currentCollisions) {
            if (collision.with === obj_1) {
              unique_2 = false;
              break;
            };
          };

          if (unique_2) {
            obj_2.currentCollisions.push({
              with: obj_1,
              type: type_2
            });
          };
        };

        obj_1.collisionStatus = {
          with: obj_2,
          type: type_1
        };

        obj_2.collisionStatus = {
          with: obj_1,
          type: type_2
        };

        // if (obj_2.type === 'player') {
        //   console.log(obj_2.currentCollisions);
        // };
      }
    });

    this.APP.scene.bulletsUpdate();
    this.APP.scene.charactersUpdate();
    this.APP.scene.transportUpdate();

    if (this.status === 'active') {
      requestAnimationFrame(this.tick.bind(this));
    };
  }

  start() {
    this.stop();
    this.status = 'active';
    this.tick();
    // this.tick.bind(this)
  }

  stop() {
    this.status = 'inactive';
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Engine);

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__APP_js__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keyboard_js__ = __webpack_require__(12);




__WEBPACK_IMPORTED_MODULE_2__keyboard_js__["a" /* default */].listen(function (pressedKeys, keyDown) {
  if (APP.underControl) {
    APP.underControl.control(pressedKeys, keyDown);
  };

  // pause
  if (keyDown === 'P') {
    if (APP.engine.status === 'active') {
      APP.engine.stop();
    } else if (APP.engine.status === 'inactive') {
      APP.engine.start();
    };
  };
});

const APP = new __WEBPACK_IMPORTED_MODULE_0__APP_js__["a" /* default */]();
setTimeout(() => {
  APP.init();
}, 1000);

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
window.addEventListener("gamepadconnected", function (e) {
  var gp = navigator.getGamepads()[e.gamepad.index];

  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length);

  console.log(navigator.activeVRDisplays);
});

class GamePad {};

/* unused harmony default export */ var _unused_webpack_default_export = (GamePad);

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);


class Grid {
  constructor(position, width, height, speed, shooter, APP) {
    this.visible = true;
    this.step = 10;
    this.APP = APP;
  }

  draw(ctx) {
    ctx.fillRect(0, 0, 100, 100);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Grid);

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Prerender {

  constructor(APP) {
    this.APP = APP;
    this.canvas = document.createElement('canvas');
    this.prerenderCtx = this.canvas.getContext('2d');
    this.renderCtx = this.APP.scene.ctx;
  }

  getData(image, sx, sy, swidth, sheight, x, y, width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.prerenderCtx.clearRect(0, 0, 9999, 9999);
    this.prerenderCtx.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);

    let data = this.prerenderCtx.getImageData(0, 0, width, height);

    return data;
  }

  draw(data, position) {
    this.canvas.width = data.width;
    this.canvas.height = data.height;
    this.prerenderCtx.clearRect(0, 0, 9999, 9999);
    this.prerenderCtx.putImageData(data, 0, 0);
    this.renderCtx.drawImage(this.canvas, position.x, position.y);
  }

  filter(data, filter, value) {
    this.prerenderCtx.clearRect(0, 0, 9999, 9999);
    this.prerenderCtx.putImageData(data, 0, 0);

    let _data = this.prerenderCtx.getImageData(0, 0, data.width, data.height);
    let filteredData = this[filter](_data, value);
    return filteredData;
  }

  brightness(data, val) {
    for (let i = 0; i < data.data.length; i += 4) {

      let pixel = data.data;
      let k = val + 1;

      let r = i;
      let g = i + 1;
      let b = i + 2;
      let a = i + 3;

      pixel[r] *= k;
      pixel[g] *= k;
      pixel[b] *= k;
      // pixel[a] += 15;
    }

    return data;
  }

  fog(data, val) {

    for (let i = 0; i < data.data.length; i += 4) {

      let pixel = data.data;
      let k = val + 1;

      let r = i;
      let g = i + 1;
      let b = i + 2;
      let a = i + 3;

      pixel[r] = pixel[r] * 0.5 + 185 * val;
      pixel[g] = pixel[g] * 0.5 + 227 * val;
      pixel[b] = pixel[b] * 0.5 + 255 * val;
    }

    return data;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Prerender);

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tile_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_js__ = __webpack_require__(5);




class Scene {

  constructor(canvasId, width, height, APP) {
    this.APP = APP;
    this.canvasId = canvasId;

    this.width = this.APP.settings.display.width;
    this.height = this.APP.settings.display.height;

    this.layers = [];

    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.visible = {};

    this.tiles = [];
    this.visible.tiles = [];

    this.characters = [];
    this.visible.characters = [];

    this.elements = [];

    this.transport = [];

    this.bullets = [];

    this.image = new Image();
    this.image.src = 'images/tile.png';

    this.resize();
  }

  resize() {
    if (this.APP.settings.display.fullscreen === true) {
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
    } else {
      // this.canvas.style.width = this.APP.settings.display.width + 'px';
      // this.canvas.style.height = this.APP.settings.display.height + 'px';
    };
  }

  addCamera(camera) {
    this.camera = camera;
    this.camera.scene = this;
  }

  addLayer(layer) {
    this.layers.push(layer);

    this.layers.sort(function (a, b) {
      return a.zIndex - b.zIndex;
    });

    if (layer.type === 'tiles') {
      this.tilesLayer = layer;
    };

    if (layer.type === 'transport') {
      this.transport = this.transport.concat(layer.items);
    };
  }

  drawLayers() {
    for (let layer of this.layers) {
      // this.checkVisibleItems(layer);
      layer.draw(this.ctx);
    };
  }

  add(obj) {
    if (Array.isArray(obj) === true) {
      for (var i = 0; i < obj.length; i++) {
        this.objects.push(obj[i]);
      }
    } else {
      this.objects.push(obj);
    }
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  removeBullet(bullet) {
    let index = this.bullets.indexOf(this);
    this.bullets.splice(index, 1);
  }

  bulletsUpdate() {
    for (let bullet of this.bullets) {
      bullet.update();
      bullet.draw(this.ctx);
    };
  }

  clear() {
    // this.ctx.clearRect(this.camera.position.x , this.camera.position.y , this.width + 3000, this.height + 3000);
    this.ctx.clearRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.width, this.camera.scope.height);
    // this.ctx.clearRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.x2, this.camera.scope.y2);
  }

  draw() {
    this.camera.update();
    this.clear();

    this.checkVisibleCharacters();

    // console.log(this.APP.timers.length);
    // this.checkVisibleTiles();

    this.drawLayers();

    // this.drawTiles();

    // this.drawElements();
    // this.drawCharacters();

    if (this.APP.settings.showCollisionsMap) {
      for (let i = 0; i < this.APP.tilesMap.collisionsMap.length; i++) {
        let item = this.APP.tilesMap.collisionsMap[i];
        this.ctx.strokeRect(item.x, item.y, item.width, item.height);
      }
    };

    if (this.APP.settings.camera.showDeadZone === true) {
      this.ctx.strokeStyle = "green";
      this.ctx.strokeRect(this.camera.deadZone.position.x, this.camera.deadZone.position.y, this.camera.deadZone.width, this.camera.deadZone.height);
    };

    // this.ctx.strokeRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.x2, this.camera.scope.y2)
    // this.ctx.strokeRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.width, this.camera.scope.height)
  }

  charactersUpdate() {
    for (let character of this.characters) {
      // this.visible.characters[character].update();
      character.update();
    };
  }

  transportUpdate() {
    for (let transport of this.transport) {
      // this.visible.characters[character].update();
      transport.update();
    };
  }

  addCharacter(character) {

    if (character.type === 'player') {
      this.player = character;
    };

    this.characters.push(character);
  }

  drawCharacters() {
    for (let character in this.visible.characters) {
      this.drawCharacter(this.visible.characters[character]);
    };
  }

  drawCharacter(character) {
    if (this.APP.settings.showPlayerBox === true && character.type === 'player') {
      this.ctx.strokeRect(character.position.x, character.position.y, character.width, character.height);
    };

    character.sprite.update();

    this.ctx.drawImage(character.sprite.image, Math.round(character.sprite.x), Math.round(character.sprite.y), character.sprite.frameWidth, character.sprite.frameHeight, Math.round(character.position.x - (character.sprite.frameWidth - character.width) / 2), Math.round(character.position.y), character.sprite.frameWidth, character.sprite.frameHeight);

    if (character.pupils) {
      this.ctx.fillStyle = "black";
      this.ctx.strokeStyle = "red";

      // this.ctx.strokeRect(this.player.center.x, this.player.center.y, 2, 2);

      // this.ctx.strokeRect(character.eyes[0].position.x, character.eyes[0].position.y, character.eyes[0].width, character.eyes[0].height);
      // this.ctx.strokeRect(character.eyes[1].position.x, character.eyes[1].position.y, character.eyes[1].width, character.eyes[1].height);

      this.ctx.beginPath();
      this.ctx.arc(character.pupils[0].position.x, character.pupils[0].position.y, character.pupils[0].width, 0, 2 * Math.PI, false);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(character.pupils[1].position.x, character.pupils[1].position.y, character.pupils[1].width, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }
  }

  // drawTiles() {
  //   for(let tile in this.visible.tiles){
  //     this.drawTile(this.visible.tiles[tile]);
  //   };
  // };

  // drawTile(tile) {
  //   // if (tile.item === 1) {
  //     // this.ctx.fillStyle="blue";
  //     // this.ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
  //     // this.ctx.drawImage(this.image, tile.x, tile.y, 16, 16);

  //     let _tile = new Tile(tile.item, new Vector(tile.x, tile.y), this.APP);
  //     _tile.draw(this.ctx);
  //   // }
  // };

  // checkVisibleTiles() {
  //   this.visible.tiles = [];

  //   for(let tile in this.tiles){
  //     if (this.tiles[tile].x + 100 > this.camera.scope.x1 && 
  //         this.tiles[tile].x - 100 < this.camera.scope.x2 &&
  //         this.tiles[tile].y + 100 > this.camera.scope.y1 &&
  //         this.tiles[tile].y - 100 < this.camera.scope.y2) {        

  //       this.visible.tiles.push(this.tiles[tile]);
  //     };
  //   }
  // };

  checkVisibleCharacters() {

    this.visible.characters = [];

    for (let character in this.characters) {

      if (this.characters[character].position.x + 100 > this.camera.scope.x1 && this.characters[character].position.x - 100 < this.camera.scope.x2 && this.characters[character].position.y + 100 > this.camera.scope.y1 && this.characters[character].position.y - 100 < this.camera.scope.y2) {

        this.visible.characters.push(this.characters[character]);
      };
    }
  }

  addElement(element) {
    this.elements.push(element);
  }

  drawElements() {
    for (let element in this.elements) {
      this.elements[element].draw(this.ctx);
    }
  }

  addMap(map) {
    this.map = map;
    // this.tiles = this.map.getTiles();

    let data = map.getTiles(500);
    this.tilesSectors = data.sectors;
    this.tiles = data.tiles;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Scene);

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__elements_json__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__elements_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__elements_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vector_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__element_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__map_js__ = __webpack_require__(5);






let arrayToObject = function (array, key) {
  let obj = {};

  for (let item of array) {
    let _key = item[key];
    obj[_key] = item;
  }

  return obj;
};

let setData = function (data, APP) {

  let elementsInfo = arrayToObject(__WEBPACK_IMPORTED_MODULE_0__elements_json___default.a, 'name');

  APP.scene.layers = [];

  for (let layer of data.layers) {
    if (layer.type === 'elements') {
      let _layer = new __WEBPACK_IMPORTED_MODULE_1__layer_js__["a" /* default */](layer.name, layer.type, layer.zIndex, layer.zType, layer.parallax, APP);

      for (let element of layer.items) {
        let info = elementsInfo[element.name];
        let _element = new __WEBPACK_IMPORTED_MODULE_3__element_js__["a" /* default */](info.image, element.name, info.width, info.height, new __WEBPACK_IMPORTED_MODULE_2__vector_js__["a" /* default */](element.position.x, element.position.y), new __WEBPACK_IMPORTED_MODULE_2__vector_js__["a" /* default */](info.coords.x, info.coords.y), APP);

        _layer.add(_element);
      };

      _layer.sectorize(500);

      APP.scene.addLayer(_layer);
    };

    if (layer.type === 'tiles') {
      let _layer = new __WEBPACK_IMPORTED_MODULE_1__layer_js__["a" /* default */](layer.name, layer.type, layer.zIndex, layer.zType, layer.parallax, APP);
      APP.tilesMap = new __WEBPACK_IMPORTED_MODULE_4__map_js__["a" /* default */](layer.items, APP);
      let data = APP.tilesMap.getTiles(500);
      let tilesSectors = data.sectors;

      let maxX = 0;
      let maxY = 0;

      for (let tile of data.tiles) {
        if (tile.position.x > maxX) {
          maxX = tile.position.x + tile.width;
        };

        if (tile.position.y > maxY) {
          maxY = tile.position.y + tile.height;
        };
      };

      APP.world.width = maxX;
      APP.world.height = maxY;

      //       APP.world.width = tilesSectors[tilesSectors.length - 1].position.x + 500
      //       APP.world.height = tilesSectors[tilesSectors.length - 1].position.y + 500
      // console.log(APP.world);
      let tiles = data.tiles;
      _layer.sectors = tilesSectors;
      _layer.items = tiles;

      APP.scene.addLayer(_layer);
    };

    APP.currentLayer = APP.scene.layers[0];
  }

  APP.scene.camera.position.x = 0;
  APP.scene.camera.position.y = 0;
};

/* harmony default export */ __webpack_exports__["a"] = (setData);

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Sprite {

  constructor(obj, APP) {
    this.APP = APP;
    this.speed = 24;

    this.animations = obj.animations;

    this.framesAmount = obj.framesAmount; // Количество кадров
    this.frameWidth = obj.frameWidth; // Ширина одного кадра
    this.frameHeight = obj.frameHeight; // Высота одного кадра

    this.image = new Image();
    this.image.src = obj.image; // Путь к файлу спрайтов

    this.parent = null;

    this.x = 0;
    this.y = 64;
    this.width = this.framesAmount * this.frameWidth;

    this.currentAnimations = [];
    this.currentAnimationNumber = 0;
    this.currentFrame = 0;

    this.date = new Date();
    this.play = 'right';
  }

  init() {
    let that = this;

    this.APP.watch(this.parent.status, 'animation', function (status) {

      that.x = 0;
      that.currentAnimations = [];
      that.currentAnimation = {};
      that.currentAnimationNumber = 0;
      that.date = new Date();
      that.currentFrame = 0;

      if (status === 'jumpRight') {
        that.animate(['beforeJumpRight', 'beforeJumpRight_2', 'jumpRight']);
      } else if (status === 'jumpLeft') {
        that.animate(['beforeJumpLeft', 'beforeJumpLeft_2', 'jumpLeft']);
      } else if (status === 'damageRight') {
        that.animate(['damageRight', 'damageRight_2']);
      } else if (status === 'damageLeft') {
        that.animate(['damageLeft', 'damageLeft_2']);
      } else if (status === 'dieLeft') {
        that.animate(['dieLeft', 'lieLeft']);
      } else if (status === 'dieRight') {
        that.animate(['dieRight', 'lieRight']);
      } else if (status === 'shootLeft') {
        that.animate(['shootLeft', 'agressiveLeft']);
      } else if (status === 'shootRight') {
        that.animate(['shootRight', 'agressiveRight']);
      } else {
        that.animate(status);
      }
    });
  }

  update() {
    if (this.currentAnimation) {
      this.speed = this.currentAnimation.speed;
    };

    let duration = new Date() - this.date;

    if (duration > 1000 / this.speed) {

      this.date = new Date();

      if (this.currentAnimation && this.currentFrame < this.currentAnimation.framesAmount - 1) {
        this.x += this.frameWidth;
        this.currentFrame++;
      } else {

        if (this.currentAnimations.length === 0 || this.currentAnimations.length === this.currentAnimationNumber + 1) {
          this.x = 0;
          this.currentFrame = 0;
        } else {
          this.currentAnimationNumber++;
          this.currentAnimation = this.animations[this.currentAnimations[this.currentAnimationNumber]];
          this.currentFrame = 0;
          this.x = 0;
          this.y = this.frameHeight * this.currentAnimation.index;
        }
      }
    };
  }

  animate(animations, repeat = true) {
    this.x = 0;
    this.currentAnimations = [];
    this.currentAnimation = {};
    this.currentAnimationNumber = 0;

    if (typeof animations === 'string') {
      this.currentAnimation = this.animations[animations];
      this.y = this.frameHeight * this.currentAnimation.index;
    } else {
      this.currentAnimations = animations;
      this.currentAnimation = this.animations[animations[this.currentAnimationNumber]];

      this.y = this.frameHeight * this.currentAnimation.index;
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Sprite);

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Timer {

  constructor(func, delay, isInterval, APP) {
    this.APP = APP;
    this.delay = delay;
    this.func = func;
    this.isInterval = isInterval || null;

    this.started = null;
    this.status = null;
    this.passed = null;
    this.timing = null;
  }

  delete() {
    let index = this.APP.timers.indexOf(this);

    if (index !== -1) {
      this.APP.timers.splice(index, 1);
    };
  }

  check() {
    if (this.started === null) {
      this.status = 'started';
      this.started = new Date();
    };

    if (this.status === 'finished') {
      this.delete();
      return;
    };

    this.passed = new Date() - this.started;

    if (this.passed >= this.delay) {
      if (this.isInterval === true) {
        this.status = 'started';
        this.started = new Date();
      } else {
        this.status = 'finished';
      };

      if (this.func) {
        this.func();
      };
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Timer);

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(0);


class Transport {
  constructor(position, width, height, APP) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.speed = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */]();
    this.acceleration = new __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */]();
    this.APP = APP;
    this.oldPosition = {};
    this.isOnPlatform = null;
    this.collisions = true;
  }

  draw(ctx) {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Transport);

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transport_js__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector_js__ = __webpack_require__(0);



class Balloon extends __WEBPACK_IMPORTED_MODULE_0__transport_js__["a" /* default */] {

  constructor(position, APP) {
    super(position, 300, 440, APP);
    this.maxSpeed = 10;
    this.image = new Image();
    this.image.src = 'images/balloon.png';
    this.type = 'balloon';
    this.zoom = 0.6;
    this.driver = null;
    this.maxSpeed = 6;

    this.input = {
      position: new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](this.position.x + this.width / 2, this.position.y + 400)
    };

    this.driverPlace = {
      position: new __WEBPACK_IMPORTED_MODULE_1__vector_js__["a" /* default */](this.position.x + this.width / 2, this.position.y + 530)
    };

    this.status = {
      beforeFlight: false
    };

    this.deadZoneScale = {
      width: 600,
      height: 500
    };
  }

  control(pressedKeys, keyDown) {
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    if (pressedKeys.indexOf('RIGHT') !== -1 || pressedKeys.indexOf('D') !== -1) {
      this.acceleration.x = 0.01;
    };

    if (pressedKeys.indexOf('LEFT') !== -1 || pressedKeys.indexOf('A') !== -1) {
      this.acceleration.x = -0.01;
    };

    if (pressedKeys.indexOf('TOP') !== -1 || pressedKeys.indexOf('W') !== -1) {
      this.acceleration.y = -0.022;
    };

    if (pressedKeys.indexOf('BOTTOM') !== -1) {
      this.acceleration.y = 0.05;
    };

    if (keyDown === 'CTRL') {
      // this.acceleration.y = 0.01;
    };

    if (keyDown === 'ENTER') {
      this.driver.transportOutput();
    };
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    // ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    // ctx.fillRect(this.driverPlace.position.x, this.driverPlace.position.y, 10, 10);
  }

  update() {
    this.checkCollisions();
    this.checkOnPlatform();

    // if (this.isOnPlatform === false) {
    //   // this.acceleration.y = this.APP.settings.gravity;
    //   // this.acceleration.y = this.APP;

    // } else {
    //   // this.acceleration.y = 0;
    //   // this.speed.y = 0;
    // };

    if (this.acceleration.x === 0) {
      this.speed.multiply({
        x: this.APP.settings.windage + 0.02,
        y: 1
      }).fixed(7);
    };

    if (this.acceleration.y === 0) {
      if (!this.isOnPlatform) {
        if (this.speed.y < 1) {
          this.speed.y = 0.2;
        }

        this.speed.multiply({
          x: 1,
          y: 0.8
        }).fixed(7);
      };
    };

    // if (!this.isOnPlatform) {
    this.speed.plus(this.acceleration);
    // };

    // Лимит скорости
    if (this.speed.x > this.maxSpeed) {
      this.speed.x = this.maxSpeed;
    };

    if (this.speed.y > 40) {
      this.speed.y = 40;
    };

    if (this.speed.x < -this.maxSpeed) {
      this.speed.x = -this.maxSpeed;
    };

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;

    this.position.plus(this.speed).fixed(7);

    this.input.position.x = this.position.x + this.width / 2;
    this.input.position.y = this.position.y + 400;

    this.driverPlace.position.x = this.position.x + this.width / 2;
    this.driverPlace.position.y = this.position.y + 370;

    if (this.driver) {
      if (this.acceleration.x > 0) {
        this.driver.status.direction = 'right';
      } else if (this.acceleration.x < 0) {
        this.driver.status.direction = 'left';
      };
    }
  }

  checkOnPlatform() {
    for (let platform of this.APP.tilesMap.collisionsMap) {

      if (platform.position.x < this.position.x + this.width && platform.position.x + platform.width > this.position.x && platform.position.y === this.position.y + this.height) {

        this.isOnPlatform = true;
        this.platform = platform;

        break;
      } else {
        this.isOnPlatform = false;
        this.platform = null;
      }
    }
  }

  checkCollisions() {
    // if (this.collisionStatus) {
    //   // console.log('balloon', this.collisionStatus);
    //   this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    // };
    if (this.currentCollisions.length !== 0) {
      for (let collision of this.currentCollisions) {
        this.whenCollision(collision);
      };
    };
  }

  whenCollision(collision) {
    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = collision.with.position.y + collision.with.height;
        },

        right: () => {
          this.speed.x = 0;
          this.position.x = collision.with.position.x - this.width - 1;
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;

          this.position.y = collision.with.position.y - this.height;
        },

        left: () => {
          this.speed.x = 0;
          this.position.x = collision.with.position.x + collision.with.width + 1;
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      crutch: {
        top: () => {},

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      hedgehog: {
        top: () => {},

        right: () => {},

        bottom: () => {},

        left: () => {}
      },

      player: {
        top: () => {},

        right: () => {},

        bottom: () => {},

        left: () => {}
      }

    };

    // if (reactions[obj]) {
    //   reactions[obj][side]();
    // };
    if (reactions[collision.with.type]) {
      reactions[collision.with.type][collision.type](collision.with);
      if (reactions[collision.with.type]['all']) {
        reactions[collision.with.type]['all'](collision.with);
      }
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Balloon);

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Watcher {

  constructor(obj, key, callback) {
    this.obj = obj;
    this.key = key;
    this.val = obj[key];
    this.callback = callback;
  }

  check() {
    if (this.val != this.obj[this.key]) {
      this.callback(this.obj[this.key], this.val);
      this.val = this.obj[this.key];
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Watcher);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(33);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(6, function() {
			var newContent = __webpack_require__(6);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,/9j/4QUmRXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAiAAAAcgEyAAIAAAAUAAAAlIdpAAQAAAABAAAAqAAAANQACvyAAAAnEAAK/IAAACcQQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpADIwMTc6MDY6MDEgMTU6NTk6MDgAAAOgAQADAAAAAf//AACgAgAEAAAAAQAAA4SgAwAEAAAAAQAAAoAAAAAAAAAABgEDAAMAAAABAAYAAAEaAAUAAAABAAABIgEbAAUAAAABAAABKgEoAAMAAAABAAIAAAIBAAQAAAABAAABMgICAAQAAAABAAAD7AAAAAAAAABIAAAAAQAAAEgAAAAB/9j/7QAMQWRvYmVfQ00AAv/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBDQsLDQ4NEA4OEBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAHIAoAMBIgACEQEDEQH/3QAEAAr/xAE/AAABBQEBAQEBAQAAAAAAAAADAAECBAUGBwgJCgsBAAEFAQEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAQQBAwIEAgUHBggFAwwzAQACEQMEIRIxBUFRYRMicYEyBhSRobFCIyQVUsFiMzRygtFDByWSU/Dh8WNzNRaisoMmRJNUZEXCo3Q2F9JV4mXys4TD03Xj80YnlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3EQACAgECBAQDBAUGBwcGBTUBAAIRAyExEgRBUWFxIhMFMoGRFKGxQiPBUtHwMyRi4XKCkkNTFWNzNPElBhaisoMHJjXC0kSTVKMXZEVVNnRl4vKzhMPTdePzRpSkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2JzdHV2d3h5ent8f/2gAMAwEAAhEDEQA/APTEkklIwKTFOkkpiVEqRUSnBaWBUCplQKeFpYlQKmVAp4WFZMnTIoUkkkipSSSSSlJJJJKUkkkkp//Q9MSSSUjApMU6iUkLFRKkVApwQVioFSKgU8LCxKiVIqJTwtKyZOmRQpJJJFSkkkklKSSSSUpJJJJT/9H0uUpUZSlS017XlMSmlMSjSLUSokpEqJKcAglRKgU5KiU4BaViolOUycFpWSSSTkKSSSSUpJJJJSkkkklKSSSSU//S9GlKVGUpVimpbKUxKjKaUqVa5KYlMSmJTgEWolRJSJTEpwC0rFMnTIoUkkkipSSSSSlJJJJKUkkkkpSSSSSn/9P0GUpUZSlW6aVspTSoylKVKteU0ppTSjSLXTJJkUKSSSRUpJJJJSkkkklKSSSSUpJJJJSkkkklP//U72UpUUldpoLylKZJJS6ZJJJSkkkkVKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP/9Xu0kkleaCkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT//1u7SXzekrzQfpBJfN6SSn6QSXzekkp+kEl83pJKfpBJfN6SSn6QSXzekkp+kEl83pJKfpBJfN6SSn6QSXzekkp+kEl83pJKf/9n/7Q08UGhvdG9zaG9wIDMuMAA4QklNBCUAAAAAABAAAAAAAAAAAAAAAAAAAAAAOEJJTQQ6AAAAAADlAAAAEAAAAAEAAAAAAAtwcmludE91dHB1dAAAAAUAAAAAUHN0U2Jvb2wBAAAAAEludGVlbnVtAAAAAEludGUAAAAASW1nIAAAAA9wcmludFNpeHRlZW5CaXRib29sAAAAAAtwcmludGVyTmFtZVRFWFQAAAABAAAAAAAPcHJpbnRQcm9vZlNldHVwT2JqYwAAAAwAUAByAG8AbwBmACAAUwBlAHQAdQBwAAAAAAAKcHJvb2ZTZXR1cAAAAAEAAAAAQmx0bmVudW0AAAAMYnVpbHRpblByb29mAAAACXByb29mQ01ZSwA4QklNBDsAAAAAAi0AAAAQAAAAAQAAAAAAEnByaW50T3V0cHV0T3B0aW9ucwAAABcAAAAAQ3B0bmJvb2wAAAAAAENsYnJib29sAAAAAABSZ3NNYm9vbAAAAAAAQ3JuQ2Jvb2wAAAAAAENudENib29sAAAAAABMYmxzYm9vbAAAAAAATmd0dmJvb2wAAAAAAEVtbERib29sAAAAAABJbnRyYm9vbAAAAAAAQmNrZ09iamMAAAABAAAAAAAAUkdCQwAAAAMAAAAAUmQgIGRvdWJAb+AAAAAAAAAAAABHcm4gZG91YkBv4AAAAAAAAAAAAEJsICBkb3ViQG/gAAAAAAAAAAAAQnJkVFVudEYjUmx0AAAAAAAAAAAAAAAAQmxkIFVudEYjUmx0AAAAAAAAAAAAAAAAUnNsdFVudEYjUHhsQFIAAAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAABaOEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgACOEJJTQQCAAAAAAAKAAAAAAAAAAAAADhCSU0EMAAAAAAABQEBAQEBADhCSU0ELQAAAAAABgABAAAABThCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4AAAAAAAQAAAAAOEJJTQQaAAAAAANJAAAABgAAAAAAAAAAAAACgAAAA4QAAAAKAFUAbgB0AGkAdABsAGUAZAAtADUAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAA4QAAAKAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAKAAAAAAFJnaHRsb25nAAADhAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAACgAAAAABSZ2h0bG9uZwAAA4QAAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xpY2VWZXJ0QWxpZ24AAAAHZGVmYXVsdAAAAAtiZ0NvbG9yVHlwZWVudW0AAAARRVNsaWNlQkdDb2xvclR5cGUAAAAATm9uZQAAAAl0b3BPdXRzZXRsb25nAAAAAAAAAApsZWZ0T3V0c2V0bG9uZwAAAAAAAAAMYm90dG9tT3V0c2V0bG9uZwAAAAAAAAALcmlnaHRPdXRzZXRsb25nAAAAAAA4QklNBCgAAAAAAAwAAAACP/AAAAAAAAA4QklNBBEAAAAAAAEBADhCSU0EFAAAAAAABAAAAAU4QklNBAwAAAAABAgAAAABAAAAoAAAAHIAAAHgAADVwAAAA+wAGAAB/9j/7QAMQWRvYmVfQ00AAv/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBDQsLDQ4NEA4OEBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAHIAoAMBIgACEQEDEQH/3QAEAAr/xAE/AAABBQEBAQEBAQAAAAAAAAADAAECBAUGBwgJCgsBAAEFAQEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAQQBAwIEAgUHBggFAwwzAQACEQMEIRIxBUFRYRMicYEyBhSRobFCIyQVUsFiMzRygtFDByWSU/Dh8WNzNRaisoMmRJNUZEXCo3Q2F9JV4mXys4TD03Xj80YnlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3EQACAgECBAQDBAUGBwcGBTUBAAIRAyExEgRBUWFxIhMFMoGRFKGxQiPBUtHwMyRi4XKCkkNTFWNzNPElBhaisoMHJjXC0kSTVKMXZEVVNnRl4vKzhMPTdePzRpSkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2JzdHV2d3h5ent8f/2gAMAwEAAhEDEQA/APTEkklIwKTFOkkpiVEqRUSnBaWBUCplQKeFpYlQKmVAp4WFZMnTIoUkkkipSSSSSlJJJJKUkkkkp//Q9MSSSUjApMU6iUkLFRKkVApwQVioFSKgU8LCxKiVIqJTwtKyZOmRQpJJJFSkkkklKSSSSUpJJJJT/9H0uUpUZSlS017XlMSmlMSjSLUSokpEqJKcAglRKgU5KiU4BaViolOUycFpWSSSTkKSSSSUpJJJJSkkkklKSSSSU//S9GlKVGUpVimpbKUxKjKaUqVa5KYlMSmJTgEWolRJSJTEpwC0rFMnTIoUkkkipSSSSSlJJJJKUkkkkpSSSSSn/9P0GUpUZSlW6aVspTSoylKVKteU0ppTSjSLXTJJkUKSSSRUpJJJJSkkkklKSSSSUpJJJJSkkkklP//U72UpUUldpoLylKZJJS6ZJJJSkkkkVKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP/9Xu0kkleaCkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT//1u7SXzekrzQfpBJfN6SSn6QSXzekkp+kEl83pJKfpBJfN6SSn6QSXzekkp+kEl83pJKfpBJfN6SSn6QSXzekkp+kEl83pJKf/9k4QklNBCEAAAAAAF0AAAABAQAAAA8AQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAAAAXAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwACAAQwBDACAAMgAwADEANwAAAAEAOEJJTQQGAAAAAAAHAAgAAAABAQD/4Q3baHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTctMDYtMDFUMTU6NTk6MDgrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTctMDYtMDFUMTU6NTk6MDgrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE3LTA2LTAxVDE1OjU5OjA4KzAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmE4ZmIwNGM4LTIyNDAtOWU0Mi05Y2MwLWNlM2E5OTQxMDUwNiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjE5YzA2M2NhLTQ2Y2EtMTFlNy05ZDg4LWUwNGFlNzMwZGFiNiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjcwYWQ5OGMzLWNkYmQtYmQ0NC05ZGRlLWE4MDM1MzQ2ODg3MyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MGFkOThjMy1jZGJkLWJkNDQtOWRkZS1hODAzNTM0Njg4NzMiIHN0RXZ0OndoZW49IjIwMTctMDYtMDFUMTU6NTk6MDgrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YThmYjA0YzgtMjI0MC05ZTQyLTljYzAtY2UzYTk5NDEwNTA2IiBzdEV2dDp3aGVuPSIyMDE3LTA2LTAxVDE1OjU5OjA4KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/7gAOQWRvYmUAZEAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQEBAQECAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAKAA4QDAREAAhEBAxEB/90ABABx/8QBogAAAAYCAwEAAAAAAAAAAAAABwgGBQQJAwoCAQALAQAABgMBAQEAAAAAAAAAAAAGBQQDBwIIAQkACgsQAAIBAwQBAwMCAwMDAgYJdQECAwQRBRIGIQcTIgAIMRRBMiMVCVFCFmEkMxdScYEYYpElQ6Gx8CY0cgoZwdE1J+FTNoLxkqJEVHNFRjdHYyhVVlcassLS4vJkg3SThGWjs8PT4yk4ZvN1Kjk6SElKWFlaZ2hpanZ3eHl6hYaHiImKlJWWl5iZmqSlpqeoqaq0tba3uLm6xMXGx8jJytTV1tfY2drk5ebn6Onq9PX29/j5+hEAAgEDAgQEAwUEBAQGBgVtAQIDEQQhEgUxBgAiE0FRBzJhFHEIQoEjkRVSoWIWMwmxJMHRQ3LwF+GCNCWSUxhjRPGisiY1GVQ2RWQnCnODk0Z0wtLi8lVldVY3hIWjs8PT4/MpGpSktMTU5PSVpbXF1eX1KEdXZjh2hpamtsbW5vZnd4eXp7fH1+f3SFhoeIiYqLjI2Oj4OUlZaXmJmam5ydnp+So6SlpqeoqaqrrK2ur6/9oADAMBAAIRAxEAPwDeP9jLqIT9nXX/ACL3vrR67v8A77/jfvXXuuv9j/vH497691737r3Xvfuvdd/4/wCw/wCR+9db+fXvfuteXXXvfXuu/wDff7f3rr3XXvfXuu/euveWT117317/AAdd+9dePXXvfXuve/de68ffuvdcbf77/ff4e99V64H8/ji3+P8Atj7sOtUPXAj/AB4/Huw611wt73XqtOuBH/Ef74/4n3brR9OsR/4r7uOqmvXA/n/bf776f192Hlnqpx1jPJ/4jj/e7f192HDquOsZ/wB9/sfdx1U9YiP999eDx/T3ccOq+XWM+7jqh9esTf77/b/7D6n3YHqhPWI2/wB79uA+fVT1iI/3n6/8Sf8AefdwemyfLrC3++/3oc82+vu460esR/Hu46oesJ/2P+2/2A/23tzqh8+sTC3uw49UPWI/77/H+ntwY49UPr1hb/ff1/2FvbgPVCOsTcj/AHr6f7H/AHv3cdVOOsJ5/rbn/bc+3B031hb/AH3+9+7jqh6wt/xPtweXVT1iP1/4j/ev6+7jps9YW/p/vf8AX/D3cfZ1U9Ym/wCJP+t+f9h7cHVD1hYX/wBt/t7/APFPbg6p1hb/AF/68f77/H3cfPqh9esTD+v5/wBY/wC8c+7j59VPp1iYf8V/1zf/ABv9PdwR031iI/Hu44fPqpr1ib/iv5/3v3cfZ1U+vWI/4f7H3cdUPDrEf+RWH/E/7D3cdVPWM/7b3cdUPWIj6/4E/wC++h93H8uqny64H/Wt/wAT72OqnrEf99+efx7cHVeuB+n+3/r/ALf/AGPuw6r1wPvfVT8uuB/p/vP+P4t7sOtdcPrcf8QP9t9f6D3bqvDrh7t1rr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv//Q3j/8PYy6iD7Ove/de8+ve/de69/xH++/Pv3XvPrr/ff8R7317r3++/5F7917rv8A4r/rf0/3v3rrx8+uve+vfZ13711vrr3vrX59d/77/b+9de66976913/xr3rr3XXvfXuve/de69/xv37r3XvfuvddH3vrVOuH+9/7zx/xPvfWvy64f77/AGPH+Hu3VeuB92611wP++t/vgL+7fb1Wny64Ef7H/ff8U92r1XrEf99/vv6e7DrR+3rGf+Rf778+7jqp6xt+f99/xT3YdUPn1jP+P+34/wBjwfdx1U+vl1iP++/p7uOqH16xEf4/74fn3YHy6qfTrEfbg6ofPrEf9b/jX4/r7v1Q/b1ib8+7g9VPWJv6e3B69NnrCR9eP+J/3j/H3cdaP2dYWH1/31/9h7uPLqh6xH/W+v8Avf4+vu46bPz6wt+f+Re3B1U9Ym/3n/X/AB/xHu46oesLe3B1Q/y6wm3twdUPWFhf3cdU9esJ+nu46oesR5/439T/ALz9Pbg6ofs6wn8/1/r+f94ufdx1WnWJv8f959uA/Pps06wt/vv99b3cdUPWJv8Aff77+vu46pTrCw/1/wDfX9uY6r1iP/E+7inVD1jNh+P94/3v6/ke7ivVT1iP++/1vdx1T7esTf7D/D3cfz6r8+sZ/wB9+Of+R+7inVD8usR/w/33+FvdgfXqvWI+7jqvH7OuB/oRf3YV9eq/n1jI/wB9/j7sOq9cD/xv3bqvXA/Tnn/ff4ce7da64H/ffn/iPdh1U/Z1xPvfWuuve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/R3jvYz6iD5de9+691737r3Xf++/3w966917/ff7Hj37r359e4/wBj7917rr3vr3Xfv3W+uv8AX/2Pv3Wvl1737r3Xf19669117317r3v3Xv8AB13/AL3/AMR711vr3P8Avvx/j791rrr/AH3/ACP3vrfXf+9e9der8+uJ9760euJH+8f8j/1/dv8AB1o/PrgeP8Pe+tfn1wYe7DHVDnrgf99/tx7sOtdYyOL/AE926ocdcD7uM9aPWIj6/wBP8Pdx/PqvHrGR/wAU926qadYz+b/0F/8Aeb+7CnVD1iPtwdVPWI/74/n3YdUOesTc/j/intwfb1XrEf8Aff05P+w92HTZp59Ym/rf8+3B1U9YT/tvwLH68/717cHVT1ib/ff8V93Xqh6xMP8Affj+nHu4Pz6oesB/3r6f4W93HkOqHrCf8f8Afc+3B1Q9Yz/sP945/r7uOqHrA3/G/wDD3cdVPr1ib8/7z/vv9f24OmzjrC3F/wDffj/bXv7cHl1Q+nWE8e7jqh6wnn/fD8/0H9fdx1U9Ym/3v/if9vx7cGOqH06wn/jd/d/z6p9vHrEeeP62/wB9/ifbgPDps9Yjb/fH3cdVPqesR/2H+x+h93HVD1hP5/33++HtweWOq/PrEfyD/r+7jqh/n1iP++/4jj+vu3VT1jJv+Of99x7uOqHrEf8AH/fD/kXu46oesbDg/wC+/wAfdx1WvWI+7DqpHXA/T/ifdx1X5HrGef8AinvfVesZ/wB9/vh7uOtdcP8AYf1/1v8AjV/duqnrgf8Aff8AEf7e3uw611xPvfVeuve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9LeO/33+9exn1EHXfvXXuuve+vde9+691737r3Xvfuvde9+691737r3Xv8Abe/db67/AN9/xr3rrXXXvfXuu/x/h/vj7117PXv+N/8AFbW9+69176+/de9Ouv8AW9769137117166976914+/de64kf776Xt9Pe+tHrgfz/AL7/AHn/AFj7sPLqp6xn3YdaPXA8f776/wBfdh1Xrgf8f+Kf0/2N/dh1U8MdYz/vv99x7sMdaPz6xn/eb/n3anz6oesZ/wB99Px7cHn1XrEbfT+n45/w92HVfz6xn/ivu46p1iP/ABW3/Ee7jqp6xH/ff8b93Hy6oesJ/wCR/T/H/D8+3B1Q54dYj/j7sP59VPWI/wDEfn/eQB7v1Q+nWJvbg6oesJH++H9fdweqGnWFv99/Tj+v09uDqnWJv68f77+vu4+zqp6wN/xH++/2Fvbg6bPWJvz/ALH6/wBfdx1U8OsRv/tuf8Pp/re3B1Q06wH6/wC+H+293HVD1ib/AGH+HtwdUP8APrCf99/vf593Hp1Q9YW/417cFeqH7OsJ/wB9/vH/ABT3cevVD1ib6/1/3344+vtwfb1Q+vWJvzx9fx/r+7jqh+3rE3P+3/2Huw6qesR9uD59UPWFh/r/AO+/5H7cH2dU6xn/AH3++5492HVT69Yj9b/n+v8AvHu/VD1iP++/33Hu46qesRv/ALx/vv8AG3u4p1U9Yz+eLe7jy6qeuB5/2F/dh1U9Yz/X/ff63uw9Oq9cD7sOq9Yzf/euLX/437t1X164H/e/98be7dar1xP++/33+v731o/z6697611737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691/9PeO/33/FPYz6iDrv3rr3Xvfuvddfj/AH3+297691737r3Xuf8Afc+/dePXf9P8feuvde/339fe+vde/wB9/vQ9669117317rv/AJF7117r349+69117317h137117h9nXvfuvddf63++/3j3vr3Xvfuvde9+691xPvfWuuB/p/re7D1611xP8AsP8AkfHvY6r1jPu46qfPrGfz/r/7x/h/tvdh5dVOOuB/23+t/vvr7sOPWj1jP9f9v/vj/r+7A9U6xn/Y/wCH0/2Hu4+3qvr1hb/ff8b93Hy6qesZP++/Hu+OqnrGb/8AIvdqjj1Q8D1hP/Gvbg/n1T/B1ib8j/ff8QPd/n59V6xN/h/rf776e7j59U6xN9f8P98Pd16qfl1hb8n/AF/dx5dN9YiL/T6f6/8AvJ9uDqhp1hP++/33+x93HVTXrCwP/G/99/T24OqHFOsJ/P1/I/3j+n+t7cHVD69Ym/Pu46ofnx6wt/yL3cdUPWFvr/S3++/HtwdU6xN/tuP99/S/u46px49YW/P+HP8AX6f7c+3B1Q9YW5+vP++/3r3cdUPWE/61v+Ne3B1QnrE35/2Pu46oesJtb3cdU6xN/vvpe3twfz6qfP06wn3cfb1Q9Yz/AMa/P5/H9fp7uOqdYT7uOqnz6xnkf76/+9e7j59UPCtesR/3n3cdVPHrGR/xPH+292+3qvWM/wC+A/339fdx1Xy6xn/b/wDFfdh1X0HWM/7D+n+++t/d+qHz64H3brR64H8f776f7yPdh1U+dOsZH4/2Pu3r1o/y64n3sdVp117317r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r/9TeO9jPqIOve/de697917rv/ff634966959df77/ff7b3vr3Xvfuvde9+695dd/77/b/wDEe9deHp1737rfXvfutfl11/re99b67I/33/FPr7117rr/AH3++497611737r3XY966911/vvpz7317rv/AHx966317/ff74/X37rXXA+7da64k/1/3r/kXvYHWj5dY/8Ajf8Aj/T3cdV+fXBufdgeHVT1wPP+H+v/AE/4p7sOtcOsZ/339f8Aifdh1U9Yz/X+v+t/xT3bqnWM/T8f776e7j+XWvXrEf8AjV+Pdh1QjrGbf8T/AIk+79VNc9YW/wCKf4f193HVD/LrGb2/3n/Y/gf7b3cdVPWI/wDFf9b3cdUPp1ib6/7H6+3BwHVD1hP/ABPu46qfPHWI/wC393GOqH5dYT/iSP8Aev8AW93Hn1Q9YW/4r/vXtyvVD1hP+++n+w/3j24OqHHWFv8Aef8AD/jXPtwdUP2dYm5vf8/8T7uOqHj1iN7Hn/ePwf8AD3cceqHrAf8Aff4j/WH1HtwdUPWE+7jqnWI/77/ibfXn24Ps6oesLf77/kXu46p1ibj/AGI/H+9j8/j24OqHrCf+NfX3cfPqh4fLrE31/wB99bf8T7uP59VPDrC3/Gv6f77j24Oq/wCDrEfdxnps+vWJh/vuP6+7g/Pqp6xH/ev99/U+7j+XVP8AD1iP++593HVT59Yj7uOqEU6xm/4+n/G/6e7DqvWM8/7x/vv9jf3cdVPWM/n/AIr/AL37sOq0rjrGf+I/P4N/dx1U9cD/AL7/AIr7sOq9Yz/T+p/4p7sPXqv+DriR/jb/AJHz/re99a64f77/AHv3brR6697611737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9XeP/33++/1/Yy6iDrr/ff76/vfXuu/999Peuvde9+6911/vv8Aeve+vdd/77/if9t7117r3Hv3Xuuve+vdd/77/Ye9de66/wB9/j/vuPe+vf4eu/euvde49+69117317r3v3Xuu/8AjX/G/euvfLr3+++nvfXuuv8AX9+691737r3XXvfWj1wPPP8Atv6f7wf6e99a/Prh/X6f8T/xHu3VeuB926qesZ/P9P8Aerf7H6+7DrRxnrGf99/vvr7v1U9cCP8Aef8Aiv8AU/6/uw6r1ib/AIpb/Af093HVOsR/33192HVfPrGf9b/jX+9W593HVTgdYm/2PB+n+++nu46qesR/pf8A2H4/3x93/LqhxXrCf99+f9v7uPl1Q06xkf77/ffT24Oqk14dYW/3r6/193UZ6bPWJv8AjX0t/vufdx1U9YWH++4/x/259uA9U/LrC3+w9uDqh6xN/vv99+fdx1Q/y6wt+fdx1Q9YW/3359uDqh6xEHm3u4+fVD1hPu46ofXrC39f9c/77/H24OqV6wn+t/8AigNvbgPVD1ia3++/335Hu46oesLf6/8Ar/8AEfX6+3AOqfl1hP1/41/gfd+qHrEf99x/r+7jz6qfU9YW/wBj/tvdx1Q/z6xH/ff77+vtwdUPWI3/AN99f8Pdx1U06xH3cdUPWI/73f8A2/8Ar/4e7jz6oesZ93H2dVPWI/0P5/P4+nu46r69Yz/viLf8Uv72Pnw6qesZ/wB8P+Re7jqvWM/7f/eB/hf3cdVPXA+7dV6xn/E2/wB9/X3sfLqvrjrgf98B/vvr7v1rrife+q9de99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//1t472M+ogPXv99/vv6/X37r3z697917r3+8+/de6979171697917r3v3Xuu/99/vre9db+3rr/fX97611737r35deH+98e/de67/AOK/76/5966317/ff7D37rXXvfuvde/p7917y+fXXvfXuvf77/ff4e/deHXv99/vfv3Xuuj/AL78+9jr3XAjj/if98PoB731U9Yzxz/vv94926qadcD7sOtHrgf98Of8fr7sOq9Yz/vv6e7jqpp1jP8At/8AD/if9b3YdVx1jP8Avv8Ae/8AWt7v5Y6qesR/1v8Aff737uOqHh8+sR/P++P5/wCI92Hp1U9Yz9f+KfX/AJF7uOqHrE1+b/8AGv8AY+7jh1U9Ym/3r3cdUOOsR/wP/ED24OqnrC1/+Rf6/wDt/wAe7j7OqdYm/P8Avv8AiPbg8q9UPWFv99/vv6+7jqh8usLe7jPVD9nWJub/AI/4r/vfu46oeHWE/wC8c/77/b+3AOmz1hb/AG/+9e7jqp6wt/T/AA/339fbg9eqH16xN7cHVOsJ/wB9/j7uOqdYW/Iv/vv9f24PWnVD1ib/AF/p/vv9693HVPWnWFvz/vubcf193HVT1hb/AH3+29uDz6oTx6wn8/77n8/7f3ceXVD/AD6xN/yL/X9uCvp1Q9Yj+foPdxwHVOsR/wB9/wAU/wBt7uOqnrEf6/6/+t/vufdx8uqHrEf98P8AfX/5F7uP59VPHrGefdhjqh6xH6f71x/T/b+7g+fVesZ/4j+v193B6oesZ/2Puw9OtHrGf+Nf69/95v7uPXqnr1wPvfWj69cD/vZv/wAV4926r1jP+w/P/FT7sOtdcT7sOtHrr3vrXXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/194/2Muog669769/h697917r3v3Xuu/z/vrfT3rr3Xvfuvde/wB9+P8AY+/de69/vv8Akfv3Xs9df77/AIn/AHn3vrfXv99/vPv3Wuvf74e/de6979177Ou/99x/vh711vj5dde99a67/wB99bn3rrfXX++59761137117H5dde99e64n/ff8V97611xP0/31v8AAe99a64X+vN/6f76/u3p1X7OsZ/w92HWuuBP1/33+sfdvTqpr1jP+A492HVOsZ+v++/3j/G/u46qesZ/33/FD7uKjrXrnrEf99/vPuw6ofLrEfqf9jx/r+7jh1XrG3++t7cHn69V6xH/AIof98fdh1Q/b1ib+v4/w9uD5ceqH5dYm/2P++492HVD1hY/n6j6f7f24BXqh6wt7uOqnj1hP9Pp/wAi+ntwfPh1Q+vWI/77/ffn3cdUPWJv97/2/twdUPWE/n/fWt/vPu46oesJ/wB9/wAj+ntwdUPWFv8AjQH++/x93HVDXrE3++/3349uDqh/n1hb6/7x/vufdx1Q9YW/IJ+t/bg+XVD1hPu46oadYT/tvbg8j1QjHWJv+Nfj3cdVPHrEf99/xP8Ar+7jqh6wnn/D/b/63twY6of5dYj7sOqefWE/8j/1rfX24MdVP29Yz/vv99f8+7jqh8+sTf7f/eP97493H8+qHj1jP+8f77/e/dxTqvl1ib/ff7H3bqvWM8f63/Iv9t7uM9VJ6xn/AIp/h/xHuwz1WnWM/wC++v8AyP6e7jqh64H/AH314/w92HWuuF/99f8A3v8Ap739nVSPLrgf94/3r8/717t1r8+uHu3Vf8HXXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/0N47/e/p7GfUQdd/77/fc+9dez11/vv9f3vr3XvfuvfZ1371175deHv3XuOOuv8Aff1976913f8A33+P/G/euvcevf77/fH37r3XXvfW/Trvn3rrXXX++/23vfXuvf63v3XuuyP+N/4e9de697917r3+9e/de66/33++t731v5de9+611xP++/4372OqnP29cD/vH+8W92HWuuB/of8Aev8AefdutHrgf9h/vv6e7da64G/0H0/33HPuw6of59Yz/vv99+fdhjqvWI8f77/Yc/192HWvX16x3+tuP99z7v8A4eqnrGR+f+Rfke7jqhx1ib/eP99/xT3cdV9esR/r/vv99z7steqdYj+fbg+XVT1ib/jf9f8Ainu46ocefWI8+7jqh6xMf9v+P98Le7jqh+XWFv8Aif8AffX24PXqh8+sRtb/AJH/AFPu4r1U9YW/3n/fW/3n3cdUPWE8/wCw/wB9x7cHVDx6wt/vv+J/2HtwdUPWJv8AfW/4r7uOqHrC3+3/AN9/vPu46oesLf77/Wv7cHVDXrCf+I93HVD1ib6f77+v+v7cHVPXrC3u49OqHrC3+8/7xb6e3B1Q/Z1ib/D3cdUPWFj/AK/++v7uOqHrEf6+3B1U9Ym/334/4n3cdU6wnn/it/p+P9bn3cV6p1jP+8+7j5dVJB6xMf8Afc+7jqn29Yj7v1UnrGf95PH+9fi/593H2dVNOsZ/w/33++t7sOq9Yz/vv9v7t/g6rny6xn6n/be7jqvl1wP++/33Puw+fVesZ/1vrb/ifdh1X7euJP8AT/Yf776+9jrXWP3bqvXve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/R3j/Yy6iDr3++/wB9x7917r3++/339ePfuvde/wCJ9+696dde99e67/33/FLe9dbx17/iv+8+/da69/vvzx7917ro+99e69791759d/8AE+/db6971170zjrr3vrXn1737rfXf++/4n3rr3XXvfWuve/der1737r3XA/42/3xP+ufe+qnj1xP04/3q3+8j/Ae7DjnrXWP6f76/wDvvp7t1Xrgf99/xv8Aw92HWj/PrgT/ALfn/Yf7z7tinVT1jb/ff7H/AGHuw6qesR/J/wBb/W/r9Pxc+7jqvWM+7jqp6xk/4/8AGj7t9o6of59Yj/yP3cdVOOsZ/wBf8G/++/1/dx1U9YT+f+J93Arx6oesTHnj/evoOR/sfd/LPVTw4Y6xH/ff77/W93HVD1iP5P8AsP8AiLfX24OqHrEf98fdh69UPWFrfn/Yf7Hn24OqdYW/3w/417cx59VPDrE3/Ef776+7jqhz1hP+t/vvwbc/T24OqdYWP++v/vhb3cdUPWI2/wB99f8AeQfp7cHVD1hJ/wB9/vuPx7uOmz1ha/8Aif8Aff7b24OqnrC3/Iv9e/8AQ3Pu46oesLf6/twfZ1TrESP6fT/ffj3cdU4dYW/339f8be7jz6ofPrET/wAa/H/I7e7jz6oesTf77/kXtwV/LqpHWE+79UPWI/0H/FPr/h/sfdx69UPWI+7jPVT9nWI/T/e/96/3v3cdUPWM/wC+/wAfdx1XrGf99a/+x/3n3YdVPnnrEf8Aivu46qesZ92HVa8M9cG/2/8Avh7uOq9Yz7t1Xrgb/wC+/wCJ/p7sOq8euB/33+x/H4926r86dcT731rrr3vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/0t4/2Muog8vl17/fXP8AsffuvZ69/vv8ffuvddf77/be99e69791vh13f/ff8T/vHvXXq+vXXvfWuu/euvf4Ouve+vHrv3rr35de/wB9/vuffuvdde99e67/AN9/vv8AYe9de69791v8uvf77/e/fuvde/x9+6117/ivv3Xv8HXE/n3sde64H6f1/wBj+ef95926rXriT9be99aPzGOuB/33+29260esZ/43/re7DqlfPrgf9f8AH093HWiesZ+tv99/vufdh8+q9Yz/ALD6/wDG/wDYX93A/Z1XrGT/AMiHPuw6oT1iP++/31vdwPLqp+3rEfdhjqvWM/n/AIn/AB+vu4xx6oafl1iPtwU6r5dYmt/yK3u4r1Q16xMf+N/737uPOnVD1hP5/wB9/vf9D7uOqnrCx/33+w/x93Hz6p69YmP+P++/4r7cHVD1hYj/AHv/AF7/AO8e3B1Q+XWI/wC9/wC35/Pu46oesRP9P8P99x/re7jqh6wN/sPz9fbg6ofl1hY/0v8A193HVD1iP++/4n8+3B1Q9YW/33/G/wDH3cdUPWIn/er/AO+/p7cHDHVD1hP++/2/u4456oesLf6/0/w/3359uDqh6xH/AJEf97/3j3cdVPWI/wC+/r7uOqHrC3++/wB9/h7cHCp6oesR/wB9/vufdh1X16xH/ev6W/1/dxTqmesTfn88f6/0H/Ee3B1T/B1ib/Y/77ke7Dqp6xH3cdVOesZ/1v8Abfj/AA/1/d+qZ6xn3YdVPp1jP++/r/X+n093HWj1wP8At+fdh1Xrgfduq9Yz/vv9b8Ef7H3YdVPXAj/Yf776/wC8+7da64n3vqvXXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/094+/sZdRD11731rr3v3W+ve/da679669117317HXY/334966911/vv9f3vr3Xf++v7117r3+t7917r3++/339ffuvenXvp+f99/tvfuvdde99e69/vv6+/de679663+fXXvfWuve/de8uuJ/wB9+fex1qvXEn/Y/wC+/wB4+vvY615cc9cCf9f+v+9/63u3Wj1wP+H092HVD1wP+PH++/2P9Pdh1o/LrGfz/tv8fx/xA92HlXqp49Yz7sB1XrGf+J/2Nrf737uOqnrGfdvXqp6xHm/5/P8Ah+P6n3cfy6qcdYm/33+x/wCR+3B1Q/z6xm3+P9P96/1vdh1U8OsR/wAef99b/Wt7uPl1Q9Ym+v8AxWxH++t7uK06oeHWE/4W93H8uqmnn1ib/ef+K/8AGvdx8uqHrE3+t+D/AL7j24M+fVT1hb82/wAfdxXps9YT/rXvwOf9fn24Pt6qcDrEbf4/8T/r+7jps9YSf99z/rf4ce7jqp6xH/ff77/X9uDps9YWP1/2P++/x9uDqp6wNz+f99/xHu46oesTfn/ev95/w9uDqh6wt/vrf73+fbg6p1iY/wDE3/2xPuw6oesTf77/AA/1vbgpTqnz6xN9P9j+P9b6/T24OqnrCf8Aff77j+nuw6oesTW+h/r/AIfn3cV49UNesLf6/wDT/ffT24OHVD1jP+++n+v7sOHVD9vWI/77/fD/AF/bg9K9VOOsRt/vX1/PH+P+v7uOqHrEf+Ke7jqp6xH8W/3v/jf4Huw615dcD/vv8Ppx/sPdh1TrGf8AW/4qPrbj3f8APqvn1jJ/P+v/AL2fr/X3YdaPDrgfdx1Xrgf96/3j/eve+q9cDf8A33++/p7t1Unrif8Ae+f9vz731rrr3vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//1N47+vsZ9RB1737r3Xvfuvde9+69137917r3++/3v/H3rr3r1173149d+9db/wAPXvfutf4Ouve+vde9+6959d/73/vv94966917/ff77/be/de6697691737r3Xv+N+/de66Pv3Xuuj/rf77j3vrX+Drgf97/4p7sOq+o64H/in++/1/dh1r59cD/vv999Pex1o9cD7uOqdY/dh1o9Yj/vv9t/xN/dxw6qft64Ej/ff6/8AxHuw+3qp8usZ/wBb3YdVNOsRP+++o/2/Pu4HVK9Yyf8Aff7z/re7j16ofPrE3/Ef8T7uOqnrEf8Abc+7j1PVTwPWIkf7b/bH/W/w93HDqh6xH/fH/X+lvbg6oesRI/31v9j7sOqdYG/p/vvr/wAa9uCvHqp8+sR/33++/wAfdx1RuPWI/wC+/H0/Pu4/l1Q9YWP/ABr/AGP+x/x9uDqh6wt/vPu46oT+zrE1v9j/AIf7H/ivtwdVPWE/77/ePz+fdx02esLH/ev9j7cXqpHWJvzb/G3u44Z6oePWE/8AE/77/H3cdUPp1hb/AH3/ACL6H24OqdYm/Pu46oesR/3v/Yf6w9uDqh8+sJ/3n3cdVPWJjz/vd+f6c+7gfLqh6xNzf/fH3cHqhPmOsLfn/ffX/it/dxQdVOesbf4f77/X93Gft6oadYj/AL6/1/33Hu4+fVesZ/23++/Hu46p1jP+xtc/77+vuw6qesR/2P8Asfdx1Xrgfp/th/vr/X3YdVPGvWM/8SbWHu46qeuBPvY6qeuB/P8AxX/eR/re7daPD5dcD+L/AJP+9f6/u3Vfs64e7da697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r/1d47/ff7H2M+og9Ove/de697917r3v3Xh139f97/AN9x71177evD37rfXXvfWvz697916nXfP+++v9f8feut8fs69791rrr3vr3y67/33+9n3rr3Dr3+39+69T9nXvx/sffuvde/3w/Hv3XvLrr3vr3XEn/iR/vr+90611w/33/E/wBPe+tdcSf99/j9b/09260f5dcPduq9cCfxzf8A4372B1qtM9cCfr/xr3YdVPWM+7jqvXAn6D8/763+8+7U6r8+sR/33+9e7/Lqh6xt+f8AkYP54/2HuwHWiePWMn/ffn3ccOqdYj/xX/er+7jqvWJv97t/yL/b+7ilOqcOsTH/AH1z/wAR7sPl1U8esbfn/ifdxTqpOOsRP/Iv98fbg6ofTrC31P8Ar/8AI/dx02eHz6wk/wC+4HtwdVJ49YmP9P8Aff093HVD/LrCT/rf7z7v/h6qT1iY/wDFfr/vf+293HVPn1hb24Om+sLf7b/if63/ANa3twdVNOsTf8j/ANh7uOqHrCT9P99/vuPdx1Q+Z6xN/jz/AL63twdUPWFv6f63+2/p7uOqH06wt9Lf6w4/x/4j3ceteqE9Ymt7cFeqHrE3+x/4j/Ye7gdUPp1hP++/33+t7uOq9Yj/AL788fj8+3PPqhz1iP8Avv8AfW93Hl1SvWJuf+J/2/u46qfn1iY+7AV6qc9Yjz7cHVD1jP8Avv8Aifp7sOqmpHWM/wC9/wC+t/t/dx1Q9Yz/AL7/AGPuw6r5dYz9D/vH+uB7sOq/n1jP++/33Hu4618+uB/33++497HVeuB/P1+n+tf3YeXVcdcT/T6/6/1/29/dh1rrh7t1rr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv//W3j/99/vrexl1EHXvfuvddf8AG/e+vdd2/wB9/vr+9de66976917/AH3+v7917rv3rr3z66/33++HvfXuu/8AX966911731vrv6e9da699Of9j/xT37r3Xv8AYf8AEe/de66/33+2976917/D37r3XXv3WuuJP/Iv6/Q+7DrVfPrgT/sf99/X3vr3XE8f8i/x976r1w/43/sPd+q9cCf8P8P9f/b8+99VPWM/76wsPdh1r7OsZP8AtrfX/Y+7gdVNOHXA/wC2/wB9f3YdV6xEj/ff776e7gdVrnrGf98f9t/j7sPPrR8+sZPu4FOmz1iP+x4Fz/vre7D16r1jY/77/jftwDqp+fWI/wDIrf778W93HGvVOsRP+8+7D06r8usTf776f76/twdUwa+nWE/T8+7gdUPWI/n/AIi/+9e3B1U/PrCf9j9P+Kf7D3YdUJ6xH/ff737cHVCesRP+9fT/AH3+Pu46oesJ9uDqh/l1hb/ff778293HVK9Yjf8A33++HtwU6ofPrC3++/w/Pu46p1hb8/77+ntwceqfn1ib+v0/w93HVD9vWI/n/kX+t/j7uP59VPWFj9fp7uK9UPWFv99+Pr/rf4D24OOeqHrEx/1/zb88/wC8e7jqnWJv9hyOf97/AK+7r1U/y6xH/e/9t/jce7gU6oT+3rEfzx/vuPdxw6qadYyfr/sOP6393Hl1Q+fWIn/ff74e7j+fVT1iP++/5Ff6+7jqh6xn/e/z/h9b/wC292HVSfn1jP8Ah/vh7uOtdYyD/h/sf9b/AHr3YY6oT1wP++/pf8292HVeuB/1v9tf/fH3Yda49cD/AIn+v15/3r3sdVJ64H/jfu/Wj/Lrj731rr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv//X3jv+I/23sZ9RB13x7117rr3vrw69/vv99/r+/de69/vv6+/de679669117317rw/33/G/fuvfn1737r3Xf8Avv8Aff096691737r3l11/vv+J976917/AF/99/tvfuvde9+691737r3XAnn/AH3+x/1ve+tdcb/X/b/7z/t+PdutcOuF/wDff7H8/T3unVfPrif9792611xJ/wB9/sP9597HVesR/r/vH+8+708utHriT9fx/wAR/wAi92HVesZP++P4/wCKe7Dh1U9Yz/vj/re7dV/w9Yz/ALD/AIm//Ivd+qnrGTf/AH3+8f092A6qesRP+9fT3egPVT1jP+x/r+f9ex92HVD1iJ/1v99/j+Pbg6qesLH/AH3093HVD1jP++/4n3ccM9UPn1iJ/wB9/vv9b3cDqp4dYmP+P+8/7b8+7jqhPr1iY+7gdUPDrCx/B5/1/wDffj3cDqpr69YT+fbg8uqE8esRNr2/P+Hu9OqHrEf99/xr24OqHz6wk/77/eP9593HVMdYj+f9a/u46of5dYW/1v8Akf8AvPtwdU6wn6/77+vPN+Pdxnqh6wt7cHVT1ib/AH3+PB/21/dx5dUPWFj/AL3/AK/P/Ffbi+leqHrEf9f8f77/AF/dwOqHh1iJ/wB6/wBb/X93HVfTrE3++/x+nu46oesRP++/31/dx1Q9Yif+R393FeqnrGeeLe7jqh6xE/T/AGP9f9793HHqp6xH/ff0/wBj7sMdVPXBvp/vhx/h7uOqHrET7sOtHrgf+Kcc+7D59V6xk+7Dqp64H/efx7sOq9cD/vv8ef8Ae/dutdcD/vv99/re7DrX5dde99a697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r/0N472M+og67/AOJ/33+296691737r3Xv999f9v7917rr/ff8i976917/AH3/ABT37r3Xvfuvde9+6917/H37r3Drv/ePeut9de99a67/AB/xAv8A76/vXXuuve+vddX9+6911/xv/ePx/hz731rrgf8Affm3492HWuuN+P8AYj/ff7D3vrXr1x976r1wJ/33+9+7daJp1wP++5+n/GvduqmnXAn/AB/4r72Mda64E/71/wAi926qesZP+3A/4n/iPdx8+q1rjrGT/vv8Pdh1r7esZP8AtuOR7uM8T1Q9Yz+fx9f8PdwOq9Yif99/vf8AsPdh1T/B1jP++/33593HVT1ib/ff76/u4+XVesTH/ff8a93A6oT5nrEx/wB9/wAR/j9fdx8+qHrET/vv95/w93HVesTf8U/33+v7uv8ALqhPWJvbg6qfXrCf+I/3n/Yfj3cVr1Q46wt/vfu46pXrEx+nu46pw6xE/X/fce3B1Q9YT/r/AO+/1ufdx1Q8esLf63+3/wBb/X+vtwdVJr1ib6/1Pu4/l1Q9YSfr/vvp7cA6ofPrET9f99/j9fduq+Yz1iPHtwdN16wn/e/9b/W93HVD1iN/qfz7utPLqp+3rE3++/p/rj3cfPqh6xH8+3B8uqnrE1/94/4j/X93Hr1Q9Yj7sM9U/LrE3++/p/vH9Le7gefVc9Yz7uPs6qesZ+l+P+I/3r3b/D1U+fWM+7jqh6xnn/jf++/x92r1o9YyR/j/AI/n/Y/7x7v1Q9Yz/wAi/p7sKdap1xP+w/x/w926r1jPuw611x9761WvXXvfWuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//R3jvYz6iDr3++/wB9/re/db6796611173177ePXf++/1v+R2966917/H/AH1/fuvenXXvfXuve/de8z1737r3Xv8Aeffuvdd/4/77/kXvXXuur+99e66v791rrq/vdOvdcD/xX/D3Yda66Jt/r/71/wAVt72B1XPXA/7b3sda64k+7fl1qvz64G3++H/Gre9gda64Egj/AB92HWjnrh7sOq9Yyf8AW/p/vvz7sB1XrgT/AMa/H+9e79V9esRPIsf+Ke7Aceqnrgx/4j/ff4+7jHVesZ/r/T3Yceq/Z1hJv/vh7uBjqpx1jb/ff8j92HVCeHWIn/Yf73/t/wDH24B+3qp6xk/X/fc+7AdU/LrG39f9455v/wAR7uBw6oesJ/3r/W93H2dVPWJvzz/r/wCP/Ivdxwr1Qnh1iJ/H+++n9Pdx1U46wsbfn/Yf776fX24Omz1iY/j/AH3+w/Pu4HVTXy6wsf6/77/iPbg6pw+zrET/AF+vPH/G/wDX93H8uqk9Yief68f778/4e7jPVD1hb8/4f1/2w+ntwdUJ6xN/j7uK9UPWFv8Abe7jh1Q9Ym/5H/yP3cDqladYSR7cHVK06xMfwfr/AL7/AHj3cdUPn1iP/Ivdx8+HVTx6wk/n/ff43593/wAHVD556xt/xHu4416qesTf8T/xN/8ADn3cdUOesTf4/wC+/wB793HqOq8OsTf77/evr7uOqnz6xn3cdUOc+XWM/k2/33A/x92Hl1Uk9Yz+R/vv95593Hl1Xrgf9b/kVv8Aivuw6qadYj/vH++/4r7v1U9cD7t1Xrhf/YfX/kfvdOtGvXAn/b/70P8AkQ926rXrife+tdde99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r/0t4/2Muog669769137117r3++/3r37r3Xv8Aev8Afcf7f37r3Xvfut9de99a67v/AL7/AH319663/g69/vv+K/4e/de/Lrr3vrX2deJ9+p17/B11731rriT/AL7/AA/3j3unXuur/wCt9Of999Pr79TqvXE/4/63+P8Avh7t1qvXAn8/7H/ife+vdcSfex1XriT/AK/+9e7Ada64E3/Pu1Otf4OsZP592Ar1Wp64H88/778j3vqp64E/6/5v/gfp7uOq9Yyf99/xHuwHWieuBP8AxW/++J+vuwp1U9Yyfdx59VJ6xk/7b/fc3/p7sBnqp6wk/wCw/wB9/wAU93Ffz6qesbH8n/ef6/n3cDqlesTf1/339T9Pdh1TrExv/vf++/r7v6HqpJHWM+3B59U6xG3+t/t/9493Hy6qesTf778+7jqh6xN/vv8Aff6/u6jqhPWEn24OqnPWI+7Dqh6wk/737cHVD1iJ/wB9/vgPdx1Un9nWE/7YH+o/3v8Ap7uOmz1iJ/4n/ff7f24OqnrC3+8/776e7jqlesTf6/8Asfbg6oesLfX/AH3+Pu46qesZ/wB9z7uB02esLH/eP9v/ALf8292A8+q9Yif99/vv8fbgGMdUPn1ib6n/AGP+w93HVT1ib/fC/wDvv6e79Uz1iP8AvH+t7uPn1U9Yj/vh/rf737uOqHrGf+Rfj/jXuw+zrXn8+sZ/33+8e7jPVDjrET/j/vrf192HVT9nXA/8j93HVSesbfT+nuwH7eqefHrgT/xNvdgOtH+fWM/77/H8/wDEe7jqp+fXE/77/D/iL+9jy6r1wP0H++/r/vfuw60a1PXD3brXXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//T3jvYz6iDrv8A5H/sfeuvde/4p791vrr3vr3XvfutdePv3Xuve/de8uve/de69f36nWuur+99ez11/r/n/jX+8+/daJ66/wB9/vN/e+tAnriTf/ef9j/vR97699vXE/8AG+P6fX3vrx64k/8AIve+q8MdcCb/ANef6fX/AHn3YDrXXHn/AHx9760TXrgT/vv6/wBP9h7t9nWq9cSf95/31ve6dV64E/8AI/dh1Xz64E/74/8AEj+lvdqda/LrGT9f+Nf193HVT1wJt/sPp/t/8R+PewOqnrET/vr/AI5/4r7v8uq9cCf9h/j7sB1U9Yif9h/T/Wtb3fqpPWMn/evdh69VPWNv8f8AXv8A7wfbg6rXGOsRP192HVDw6xE/4/15/wAf9vxx7uBnI6oTXNOsTH/e/wDX/wB9x7uvVSesbH/iP+K/Ue7gdUPWEn/ff778+7gdVPWJj/vrC/0/4r7uAOqHrEx/3r+ntwDqp9esTf0/H/I/x7uOqHz6wk/n/H/b293Hp1U16xH/AH3/ABr3cdNn+XWJj/vv9b/X/wAfbgHVP8HWFjx/vH5F/dx1U/b1ib/ff77/AGPuw6p1hb/ex/vv8fbg6oesTH/Ye7gdU6xMf99/xT+vtwDqp6xE35/335/4p7sMdUPmOsTH/in/ABX/AF/bgGOqH16wk+7jqp869Yz/AK1v8frzx/xT3dfLqpp69Yif99/T3cY6oesRt/vf+92/2Pu46qesZN/9a/uw6qesRP8AsP8Aiv4/1vblOqdYyf8Aff6/+x92HVeuB/331t/xPu3Vfl1jP9f8f99+Pdh1X5dcD7sOqnjXrGf999fdh1o18j1xI4/3k/8AGvdh1Xrgf99/xr3YdaPr59cfe+tde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//U3jL/AOw9jSnUP167v7917/B11f8A4r79Tr3Xd/eqde69f/ff77/W9769173rr3XV/wDff8V97p16uadev/vv8Prx7917rq/+tx791rrq/wDiOf8AkV/r73Tr3XV/9h/vv8fz73Tr3XG5PvfWuuif9t/vvp73TrVa9cfe+tdcSfewOtVzTriT/wAi+n5/w97HrTrRPp1xJ/3jj/ffge7fn1qvXAn/AIp731XrgT/xH1/Hu3r1Uny64Ejn/ih/5H7sOtE+XXAn3YDqpPXAn/iP8P8AW/1/r7sPt61XrET/AL19Ofz/AMj93HVT1wJ/33+++nvfn1WtesZP++/3x93GOqmvDrGT/tvdgOqE0HWMn62/331/3j3enr1o9Yifdx1Q9Yjb+tv99xb3cV6rXrET7sB5dUPWJj/vuP8Affj3cdVPr1jY8/U/8U/3w93A6ofPrCT/AL3+fr7cA6qTx6xE/wC9e7jqla9Yyef9f3ccOqHrCf8Aff77/X93HVD1iY/77/ePdx1U9YWP++/3v24OqE9YmP8At/8AeP8AH3cdUJ6xE/77/C3+393Hz6qfMdYmP1/33+8e7jqh6wn/AHx+v59uCpp1Q9YifdwOqGvWJv8AHj/efdx59VJ6xE8+7gdUPWNrc/0/2P8AtrfT3cHqhPWFv99f/ifr7uPLqp6xMfx/r8/71/T8e7/MdVPWM/77/in+w93Hr1TrCxv/AL7j8+7j7Oq9cD/vv9v7sPXqvWMn/e/9Yf1/w92HrTqh6xH/AH3++/1/dx1o9cD/AL7/AG/+8+7eXVD1jP8AT6c3P9P+NW93HWj5dcD72OqnrGf97H5/P+Hu4611x/4n/W/w976r59cD/vv8Pduq9de99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/9XeJv8A4/63+2/p7G3UPV67vz/S/H+9W/xt71175dev/wAiH9f949+63Xru/wDvrfj/AHr8e/U6111f/iP9j79Tr3Xr/wCP++/Hv1OvV9evX/2H+H+98+/U6117m/8Avv8AY+9gderjrq/5P+t/r/i9/fuvV66J/wBt/vufe6de64k/8V/1ve/t619vXG/vdOtV66J/4j3sde6435/2H++/1vr795dVPXG/5/oP9bkfjn3un7OtHrgT/vf+9+7jrVeuif8Ajf8Aj791rrgT/vf+N/8Abfj3anDrRNOuBP0/33/ED3YDqp8+uBP++/p7tT5daJ6xk/4/6/Hu1Dx6p9vXAm/5/wB8B/t/dgPQdar1wJHu1PTrXWMm/H1/r+P8fdgOqk4+fWMnn/ff8U936of59Y2P/FPdh5dVPWIn6/74f4+7gcMdVPXA/wC2/wB9/jf3amOqk9Yif97/AN9b/D24B1Sp/LrET7sOqH7esTHk/wCx/wBh/rf6/u4+zrR6xE/6/wDT6f7D/be7gevVD9vWJj/j/X/ff7H3cdUPWIn/AH3/ACP6c+7gdVPWJj/vv9v+fdx8uqHrE3++/wAPp7cHVCesJ/33++/Pu46qesRIH/FPx7uB1TrEfbg6oesJP+P4v7sB1U9Y2P8Avv8AiP8AD3ccOqHrEx/4n/ff4+3B1Q9YSf8AjX9P+K+7gdUPmesRI/2H1/2/0PH+v7uOqn7esRP++/43/sPdxw6oesRP+9fS/u4Hn1U9Yif9b/Yn3cfb1U9Yyfzx/wAV/wBjx7vTqnWEn/ibf8b+nu4z9vVesbf4f763u46oT69cCf8Aff092HHqp6xHj6fX/D+v/Ffdx8+HVTmp6xn/AH39fdh1U9Yzb/H8fnj/AGHPPu/VTx64H/fC39fe+qmteuB92HVeuB/33+Bt/vVvdutVpw64H825/wBtb/inu329a64+99V6697691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/1t4b/kXscU6hwcadd3H4/wBb8/8AIr+9de4inXgf9t9ePz/t+effqde9fXr17H34jr2adev/ALD6f763v1Ot9euT/T/fWHPv1B1rrq/++5/4179Trf59ev8A77/iP9h73TrVeur/AO+/2Hv3Wuur+906911f/fD3unXuuP8Ajx/xr/ivPv3Wq9dEn/fD/ff1976rjriT/T/X97691xv/AK3+sef999fe6dar1xJ9260T1wJ/4n3anz6rXy64/wCJ/wAf+Itx/r+99er6dcCf95/5F7t1QnNeuBN/9h/r3/3r3YYHHrR/l1wJ/wBv/vvx9Rf3b161X9nWMn/Ye7DqvWMn/jfuwHVK+fXAn3YDqvWMn/ff6/8AxPu4z1UnPWMn/ev8R/vre7AdVPWIn3cDqpPWMkX/ANt/sP8AX/1vdwKdV6xk/wC+v/j/AF92A8uqk9YmP+2/I/33PtwDqlf29Ymb+v8Avv8Aevrb3YDqvn1iY/77/bf093HVCesRPu/z6qT1iY3/AN5+l/8Ab/0Pu4HVD6+fWJj/AE/H+8+7jqhPWIn/AGP+9f7Yfn24B1Unj1iJ/wB9/rfj+vuwHVD1iP8AxP8At/bg6qT8+sRP++/3j3cDqhOesTH/AHn/AHnn/iPdx8uqHrCx4/2//IvdwPl1X59Yj/vv+R+7inVD1ib+n+H+x93APVDT8+sRP+P+8393HVT1ib/ffT/be3B1QnrET/vv9h7t1UnrGT/xTj3enVD1iPH+w/5F7uBw6rX5dYzyP+J/3n3cdVrTj1iP+vf3YdUPWNv6Hm9v9j7uP59VPXA/14/pb/Y8/wCw926r1iPu/wDh6qeHWMm/+3H9T/sPdqdVPXAm/wDh7sOtevXA+7DqpPXE/Tn/AHj3vz6rwOOuH+uPp/vH5/p7t149cPduq9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf//X3g7/AO+Hsc06hqvXr/77/ePz79Tr1eHXYPv1Ot169e3/ACL36nXq9ev/AL7+n+9+/U69q69f/in++/2Pv1OvddX9+69XrxPvfWq9dX/x/P8Arf4+/U+XXvz66vz/ALzb/fD3vrVf2ddXP+8/73+P9t78B16vn1x+tx9P9j9Pe+A6rXron/X97pw69XHXEn/efex1qvXAn/e/96/3se7U6111c/6/1/3j/W97oOtV64E/77/fW49260euJP8Avv8AkfvfVcdcCf8Aef6/8R/h7tQ9V64E8f1v/wAR+f8Ab+7Adar1jJ9260euBP8Aj/X/AG39f9f3YD5Y6qTnrGT9ef6/8T7sB1okdYyf98P+Ke7AdUNOHWMnn/bfnn/fX92A/Z1Wv7OuBPu4HVT5nrETcH/WP+w/31/d6Z6oT1jJ/wB9/sPdgM9VPr1iJt/vv+Ne3AOq9YmN/r/j7sB+3qpp1jPP++/437uOqnrET/vr+7jqh6xMf99f3cdUx1jJ/wB9/T3cDqpPWEnn/ffT/b/0Pu4GOqknrEx/1vdx02T6dYmb/ff8V93A6qaGvWJj/rWube7jqh6xE/77/Yf4fX25T9nVT1iJ/wBj/vv9692A6oesTH6/0+n++H193A6oesJ/437cHVT1jP8Avr/74H3YcRTj1QnrEx4/3n24OqnrExv7uOqdYifz/vv9h7uB1XrGTyf9Y/7Hi3492HVD1iP+3/33/Gvdx1U9Yj/t/wDb8/j3cdUJx1jJ92HWusZP/Ef71/t/d+qn18+uB/x/2Fvp7sPI9UPWM/7b/YfX3YdaOcdcCeP99cf8a93HVPXrGfex1r5dcP8AW92+0daPn69Yz/vh+f8AYe79VPXE/wC8fj/if6+99VPXXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/9Dd/v8A7H/H8X9jynUM167J/wB5/Nv+Rfn34Dr3Xr/8V/r+feqde8+vXP4/P4Nvfqder13f/Dn/AH3+39+p17rq/wDxoX+ot79Tr1a9ev8A63+8Wt9L+/U69Xrom/1/31+D/vXvfr16vXr/AO+/N/p78B1ryPr1xv8A77j/AH3097p69arn5ddE/j/Hj+v+w97A69Xron36np1qvXEn/iv/ABX3YAnrRPXG/wDvhf8AH+H5597A/Z16vXEkf73xz/vuB72B1Wp9euJP++/43+fe6UHWuuN/99/xHvdOq16xk/77/ffX6e7068euJI5/33/GvewOq164Ej/fH/Yfn8+7AdaPHrGfduPDqnXBv9j7sOtV6xkj8H+v55P+t7sB59Vr1wJHP++IH+392ofXqtesZP593A6rXj1jJ/w/33/Ee7AU6qesZP8Ar/763+w93A6qesTH/eebf778e7gcfXqvXBj7sBw6p1iY/wC8/wC+493A6qfTrET/AE+n+H0/3n3ceXVa8esRPuw6ofs6xk/8T/xP493HVT1hJ+v+9e3AOqHrEx+v+x/p7uB1Q9Yif99/vuPp7uOqnrGSf6+7gdUJ/Z1hJ/3x/wAObe7gdV6xM17/AOx93HVD/PrGTx7uOqHrCxv/AMU93A6qesbH/efp/t/bgFeqHrCT/wAT7sB1UmvWM/7H/eef6X/w93A6oT1iJ/439Pdx1X/B1iJ5/wAef8f6fj3ceXVT1jJ/5F+Pdx9nVD1iP5/33+++nuwx1qvWM/T/AI1b/ib+7+fVD9vWM/73/vv9v7sOJ6qesZ4B/wCREX/1vd/TqppXPWM8e7Dqpx1jN+SP9f8A5H7sPTqp/l1wJ92611wPu3VOuF/9f/bf4XFvdqdaPXA/7Hj+v4492HVeuPvfWuuve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/0d3u/sfU6hevXd/99/vvx7916vXr/wC+/wBf3759er17/if9496p17ru/wDxH+2/P497pw69Xrq//Ee/U9OvV68Tf8+/AdeqPLrq/wDj79TrXXr+/U69/g64k/77+v4/w92p1qvXRP8AxP8Avv8AX49+p69er10T9f8AbW/PP+9nj3unWq9cb/7z+ef999Pe+tdcb/4+9069Xrjf3bqpPXAn8f097p17h1xLf0/33/Ee9gdUJ8uuJNv+R/73735568T8+uBPuw6qT1wJ/wB4v/vHuw6qTxHXAn/fX/2P5592A61mvXAn+v8Avv6e7AcAOq9Yyef99/vH493ArxHVa9Yyf9f/AGP+9e9gU6rXrgT/AL7/AGPu4Feqn7esZP4vb/ff6/N/dx60x1WvWIn/AGH+PuwHy6qT1wY/X/iv+t+Pz7sPs6p1hJ9uAdaJ6xk/4n/fH/X92Azw6oT1jJ/4n3cDqtf2dYib2/330/r9Pdxj7OqE06xMf99/vr+7gdV86dYif97/AN4t7uOqE56xk/77+nuwHVSf29YmP++/4n6+3AOqnrEx5/33++v7uB1QmnWEn/ff7x7uB1U/z6xk+7jqhPWIn/ff6/8AsOfdv8PVD5dYmPu4HWq+XWJv9f8A2H++49uD1pnqlfTrEx/4gf76/u49a9N9Ym/xP++H/Ffdh1o9Yz/h7uPPqh6xN+f6/wC9e7j16qfIdYyfd/Ovn1QnrEeP9h/yP3b59VPXA+7Dqp4dYm/33++/Hu/Hqp6xn/ff1/31/dxXqvr1wP5/3n/W92GOqk56xn/XH+x/w92HVeuB/wBb6f77m3Huw+3qvpXrgT/W/u3WuuBP/E/8i/px7sOtdcD/AL7/AF/e+q+fXH3brXXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/0t3gn6f73/xq/uQKdQpx67v/AL7n36nW/wA+vX/3n88/7D36nXq9ev8AT6f763/Ffeqder16/wDj/vuOPxf36levV66uf+K8+9069X9nXWr/AB/4r73TrwPr16/5/wCN3/1x71Tr1fl11f6/4fT/AG1vrx731rh5ddX/ANf6/wBPe6der10Tz/t+P95vfj3ulOtV4dcb+/dar11qv/vh/t/e6fs61Xrjf/ff71/sPe6dar1xvfjn8fS/+x/2592p1rriT/vr/wDGv6j3unWq9cCfdvs60T1wJ/4n3sevVeuJPNv9e4v/ALf3YDrVa9cCf+R/7C3u1PLqtesZP9P999fdgOtV64k/W3++/HuwGeq16xk3/HuwGeqk9Yyfxx/tx/j+OfdgB1o/PrgTx/j9P8f63/x92A6pXj1iJ/2Pu9Oqk9cCf+Nf8V/p9PdgOq16xE/77/kXu/VT1jJP/Izb/eOPdwB1UnrGx/33++/x92HVK06xE+7gdVJ6xE+7gdVJ6xkj/ffX/efdwOqHrEx/2Hu4HVT1ivf/AHjn/jf+Hu3VTjrExt/vvz/yI+7gdUJ6xk/0/wBv/vj7cH8uqHrCx/33++Puw6qesTE349uLgZ6qfPrGT/vvzb8e7dUPWIn/AB/2/wDtvp7uOqHzr1jJ/wBv/sfdxw6qft6xE/8AG/p+P9493A9OqHrEbce7gcetE9Y2P+P4/wBf3YfLqnr1iP8AyL/bD/W93FcdUPWMn/Yf77/ePdx/LqpPWI/T/ffX/be756qeOOuB92HVa9Yv9Y2H/Gvdvt49VPz49cGNv8Bx/vXu46r9nWO/P/Gvr/j/ALf3anVT1jP+8/4/09260eGOuHu3VeuJP/Ef77j3bqp64f7bjj/Y/wBP6297611xP/FPdutVz1x97611737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/9Pd01f7Af6/+HuQ6Z6hLr1/95/41/xT36nz63Xr1/8Aff8AGr/T37hXr1evXt9Lfj36nXq/PrsH+v8AW3++/Fh71mnXqnrq/wDyL8f77j3unXq9eJ/33+Pv1OvV69f/AA/p9PfqfPrR66v/AL7/AH39Pfqda643/wCRe99er10T/j/vvp73TrVeuN/6/n/Yf7H3sDr1euif+Kfj/b/T3unWq9cSb/0/339f9j73SmR1qo64k+7U60SOuJP++/331497p1rrhq4/2H4P/G/9497p1rh1wJ/23P8Asf8Ae/ewP29arTriT7tTqpP7esZP1+hH++/1/dwOtHriT/xX/in5/PvYHVa+vWMn/ff778X92A/Z1WvXAt/vj/vr+7U6r69Yyefr/vv+R+7060T1jJ/33+t/sD7sB8uq164E/wBDfkcD8/7H/Ye7AdUr1jY8+706rXrGW/33++/x92HVT1jJ/wCNf77n3cDqh6xE8f73/vv9h7sB1o9Yieb/AO+/437uB1Q8OsTH6/776/4e7gdVPWNif+I93HVa9Yyf99/r+7gdUJ6xE8/6x/r/AMV/HuwGOq16xE+7jqjHrEfzf68D/jXH593A6qf5HrEf99/vv6e7jqh/n1jJJ/3gf6/u/DPVTSvWMn/eP8P+KD3cCnVDTh5dYSf9ccf8b/r7uB+zqp6xsfrf/fcf4+7D5dUPWMn/AHu/H+2/2Hu4889aPHrETf8A33+Pu48uqHrET/t/+J/PPu9P2dV6xmw93A6p1iNv+RfT/G3u4r1r7OsZP++/w92H8+qV6xk/77/Ycce7Dqp64XP+3ufdqeXVSa9Yz7uOqnrh/vf0/wBb/Ye956qePWM/0/3n3cdaNeuBP1926r1xP+H+v/xr/W5976rXjXrh+Lnnn/ff7A+7efWvPrj731rrr3vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/U3b7/APEcf6/+9e5Gp6dQgOu7/wC+/wB9+PeqDrdR16/4/wB9/wAU9++fWq/Pr1/99/vr+/U69Xr17/77/Ye/U63/AIOvX/31/wDX/wAPfqdar11f/fc+90+XXqnr1x/xv/W59+69X5Z66uef+Nn8fj/Wt791qo66LC//ABv/AIr72OFOvV643/x/p9f+KW/x97+0daqevFv+N/7b36nWq9cCf99/vPHu1OtdcS3vdP29e66vzx9f8f6f7372B1Wvn1w1f77/AH1/z7tTrXr1xJ/33+397A60T5dcS3vdPPrVePWMn/ff64/w92A61XrgSf8Ajf5/qfr7sOqkg9cCf9j9Pe6dVrx64E/7f/ef+R+7gdaJ64E2/J/33+392AHHqpPWMn+v/I/dgOqk9Y2PH++5/wB693FPLqvXAn/H/fD+nvYHy6rXz6xE8/8AG/8AffW/u9Oqk9cCeP8Aff763uwHDqp6xk/m9/dwOq1p1jJP+8/n6e7gdU6xE/j/AIp7sB1UnrESP+Nf7D/b3v7uOqnHWJj/AL7/AIn3cDqua9Yyf99/xv8A2P8AsPdx1WvWNj/xr+v/ABT3cD14dUPz6xE/77/H/e/dgOqE9Yj7uB1U9Yif99/vXu4Hp1XrGT/vv9j/AE93HVT1iJ/24H+H4/1vdh1QnrEfbgrQdUJ6xsf99/vvz7sK06qT1jJ/x/x4/wCNe7jqpJ6xMf8Aff7f+vu4+fVT1jY/7bn/AIj/AB93HHqh6xn3YDqp+fWI/wC8+70/Z1U/LrGfz/yL/jQ92HVesZ5/I/2/+8/j3f7Oqk9cCf8Aff7z73Tqtf2dYyf6f7bn/iPz7tTrR64H/ff7Hnn3fqhx5dcD73+fWj1wP+v/AL78f6/u46r1wP8AX6/73/vj72OtdcT/AI/7x/vuRce99a64+7da697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/1d2rV/vH/FP969yTTqDuu7/8R/t/fqder14n/inuoHXq9ev/AL7j3uhz16vr16//ABr/AH1/px73Typ16vXtX4/H+9f8V96p175169q/4j/ff19+A+eOtV/Z17V9P+RfX36g6910W/3w/wCK+90+fXv8HXG9re9068T11f6f77/fH3unWq9cb/77n36metevXEn/AH17/wC9e7AfPrXXRb/H+v8Axo+90+XWvt64k/8AE/73f3unHr1euJJ/x97p5dVJ4dcSR72B5+XWifn1wJtcf8T/ALH3YfZ1qvXAn/ffjn3YDrRPXAn8f77/AG/uwHVSeuBP++ufrf6/7H3uleq164E/8bv7sOq149Yyf+K/4/n/AB93HWq9cCf99/vBvfn6e7D5dVJ6xluP+I/w92A6rX9nWMk/77/fc+7DqtesZP8Avv8Ainu4Feq9Yyf9j9P9f3YAdVPWMn6f7z/yLj3YD06qT59Yyf8AffX3cDqp6xk/7x9Pp/vXu9Oqk9YifdwOqE9YmP8Avv8AiPdwOtE+fXAn/efr7sOm69Yif9t/vf8Ahb+vu46qfTrET/vv999fdx8+qnrG3/E/8R/vPuw6qSOsbH/evdwP29Ur1iJP+98f7z/j/X3cAenVT8x1iY/7D/ev+N+7AdUJ6xsf6Hn/AJF/t+PdwPXqpNOPWI/8bP8Ar/n+nu4HVSesZP8Avv8Ajfu4x1SvWI/1v9f9vb+vuw+zrXr1wJ/2w/437uKfn1U9Yif+I/3o+7Dqlfn1jY/77/H3f5dV64E/X/ev9jx9fdvTqtesR/P++/23+vb3b06qeuBt/t/9f/fD3cdV64H6f7D/AH3+Hu3Wqnrgf98D/wAi97HVSeuB926rXrGf8P8AH/ev9793HWvl1w/43/xvn/H3vrR+XXH3vqvXve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/1t2W/wBP9v8An/H/AHj3JlP29QXXrkG/1/eqder8uutX/G/99x79T5der13f/H3qmet166v/AL7+nvdOvV69q/4378R1rPn16/8Axv8A31/fqder11f3sDhjr3p11f8A43+f+R8+/AfLr1ePXRP++v7369a/w9davz/vv9j/AK3vfy8uvV643/w9+A60flx66LX/ANh+B7sB1qvl1xLe/AZ60T1xuf8AXvwD7sB1qvr1xLcf0/3j/fW97/wda4n5dcSf+N/776e9j18utV64E/74f77j3amR1UmvXEn/AG/+8e9gV+zrVesZP/FP99/re7gfs60TjriT/vv9Ye9gdVr1wJ/33P8Axv3YdVJr1jJP+9/7H+h92p1U+nXAt/vvx7sB1quesZb/AGP+P++55I92pnqpPWMn/X/2/wDsPdwOq16xk/8AIv8AG3592p1U9cCf+I/3w/w93A6qT6dYif8Aff7H3YDqhPWMm/8At/8AYfj6+7gU60T1jJ5/339PdqdUr1iJ5/339f6W593A60T1jJ/33+P55/p7sB1QnrGT/sPqeR/vh7uB1UnHWIk/8V/4j+n9Pdh9nVD1jJ/417vTqp6xkj/evdwOq9YmNh7uB1UnrGxH/I/9h/tvdwOqV6xMf99/vv6e79VPWMn/AJFxx/sP9b3YDPVT1jJ+v/EW/wB493HVCesRb+v5/wAPdqenVT1jJ/33+8+7jqpOesZ/33+vf/W926rXrGf+K/74f4+7gdVr6DrGT7sOqk06xk/1P9f94P8AvHuwHVeuBP8Arf77/iPdvPrRPWMn/W5/417uPs6pnrgfr/vv9h9PdutHrgbe7DqvXAn/AB/p/rjn3sda64Ec/n/ev9f8e7Dqvl1xP+v/AL78n3brXXH3vrXXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/192HV9P9c/U+5Pp1BNevA/T/AHn/AH3+t71Tr1evav8Aff7H/be/UHXvLr2r6f76/vdP2der13q/3r/kQ/1/eqder11f+n++/wBfj36lePXq9eJ/5Hcf4n36nn16vXWr/ffX/fce/Ada68T/AL7/AJH73Th16vXG/wDvXvdOtV+fXWr/AHnn6f7f3sDrx66v/vvz79Sh611xLf1+vH+x/wB8fe6dar11fj/bf717tTPDrR8uuBP++/339fe6dar1xv8A8T73Tr1fXriT/vuPr+Pe6dVr8+uJb/jf0/1vdqHrXz64Xt+f9f8A3n3YDqp64E/8b/339ePdqeVMdeJ64E/n/ifyOOPe6enVSfn1wJ/33492ApinVSeuDH/b/wCP/Gh+fdgOtE9Y2I/1/dgOqV64E/7z/vuPdqcOtEnrGTb3YDqlfU9Yyfr/AI/73/yP3cDrR6xk/wCP+x492A6pX06xk/8AFP8Abe7gdar1jY+7AdUJ6xk/8j4/4r7vTrRPWMn/AHge7AdUJ6xsb+7gUp1Wv7OsRP8Axv8A5H7uB1Xz6xk/71/xB92A6qesbH/ff7Hjj3YA9UJHlx6xE/77/fce7gHqp6xn/e/9j9Pr9Bz7uB1Unz6xkj/ff778+7geXVT1jJH/ABr/AFj/AIe7AHz4dV6xN/vv99/T3cfLqhPWNv8AY/77/Yj3YdVOesZ/31uP99b3fjx6r+XWInjj3f59VNPPrGTb/ivu3Hqp64E+7AfLqpPWI/1/r/vX+t7uOqnrgT/vv9t9Pdh1WvXA+7dV64Ej/bf77/Ye7AdVNfXrGT/vv9h/rW/Hu1OtdcD/AL78+99Vz1xv/vh+P9f8e7U611wP++4+nu3WuuJ976r117317r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//Q3XNX+9X/AN9+PcpU8uoGr17V/j/h/vX+88+/U6913qH+3/33+t71T1HXuutXv1KfZ1snrxb36levV69f/ePfqfs61Xh10W/p/vv68/097I4Dr1fXrxb/AI1+P+Re/AenXq9dE/77+v8AX+n597A61Xh11c2P+8/n+v8AxPv3Xieuief8Lf4f4+9gfLrXXG/vdOvHrrV/T+trf7x/vXvdOtV/b10T/vv99xz78B1qvXG//G/98PdqY60T1xLWvcg/0/P4/wBt73T9nVa5PXC/++/1/qfe+vEnriT7tTrRJ6x3/wB7/wB9b3anVSeuJb/ff7b/AHn3unz60ft64E3/ANf3an7Oq164Fv8AfWuPdqdVJ9euBP0/r/j+ef8AifdgP2daJ/Z1wJ/Hu1PPqpOesZN/9e3++/Hu3D7OtdcCfxx/vv8AifdqdUr1iJ/33/Ee7AdaPXAn6f0/2H+9ce7gdVr1jZv99/r/AOHuwHVCesZP+3/43+f9t7uB1WvlXrgT/vv9j7sB1XrExt/sP99/Ufj3YDqp6xsbf74fW/8AT3cCvVSesRP++vx/xo+7jj1U9Yyf+Kj/AInke7U6qT1jJ/4j/jXu4HVSesZI4/x/2P04/wAP6e7U6qfPPWIn/ff76/u4HVK9Yyf8f9f3enVT1jJ/r9eP+K/8T7sBSnVa8OsbH/fH3cDqlfl1jJNv+Rf6/Hu1B1U9YyfdgOqk9Yief8Pxf/iv9Pd6ft6qeuBP+2/23+v7sB1UnrGT/rcf7D/ivu/Wj6dcD/yL/ebf7x7sBw6oesZPuw60ft64E/74/wC+/wAPdhx6r1wJ/wBj/vv9h9L+7DrXXA/77/kfu3VeuB/2/wDvuR/vPvY6qeuJP9Bz/vj7sOtfn1wJ/wB9/j7t1o8OuPvfWuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//9HdW1f77/ffm3uVKHqA68evX/r73Tr3Xer+v+x/33+t71Qdbr6dev8A4/77/ePx79T169Xr2rj/AH3+tx79Qda68D/xH049+p1uvXWr/b/8U/r73Ty61X069q/3w/41/Q+/AevXq9daub/T36nl5da661f77/ffn3v069XrrV/T/ff71/T3unXq9davze3+w/4n3unWiaeXXEt/t/fqdarx646v99+fe6U61Xrot/r+9gdaJ64E/wDE/wC+v7sB1qvXEn83/wAR+ORx/sfdqHrVeuBP+35v73TqteuJb/H/AIj/AIj3sDr3XAt/yL/fc+7U6rXrhq/3v+n+98/j3anVa8fXrgT9P95H/FPdgOtV64Fv8be7Adar6dcCf6f7x/xPu1OqE9Yyf99/vP8Avfu1OtV64E/T/ff74e7U6qT1jJ5/2HH+HuwHWq/PrgT/AL4+7AdVr1jLfj8/7xwf+I92A6oT8+sZP+w/3v3cDqtfn1wJ5t/xX/Yc+7AdVJ6xE83v/wAU/P8AT+nu4HVa9YyfdgB1UnrGT9fz/sf9j7uBnqpNOsZP++/2H+P9PdgPXqlesZb6f7635+nu460T1jJ/pf8A3w/p7vTqp6xE/wC+/wBh/r+7DqlesZP0/H5/3n3egr1U9Yyf99/sPp7sBnqtesZP9P8AfD/jXu46r8+sZ/33/Ffdv8PVSePWMn/ff1+vuw6qT1jPH/FP9t7t6HqpPWNj7uOqk564G/8Avv8AW/437sOqmnXAn6/77/kXuw6qesf++/33+Pu3Wq9cCf8AjX++/wBb3YD59V/Prgf9h/xH9fz7t1X/AA9cCfex1rrgT/sT/rW/w936r1x/339f68+99eNeuJ976r8+uve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9LdQ1f42vb+n/G/csEeQ6gCo67v+f8AD68/19+p1uvEdev/AI/7b/invXXq9d3/AN9/X36n7evde1f778/74+/U69X166Lf7xcf77/D3unn17r2r/e+fp/vj71SvXvXrrV/r/77+o97p1qvXtVv9Y/U/j/ePz79TB9evV661f8AFfp/sb/X3vz69XriW/33++/r7tTrVR11fn/H/ffT36n7OtV66Lf77/jf097p+zr1T1xJ9+A/b1onj1xv/vv9t+fz7tTy611xLf7x/re9gdaJA64lj/X/AFve6fLrVcdcSf8AfW92p1qvXAk8Xt/vv8OPpf3YDqpPHrgT/vvz/sfe6dVr1xLf0txx/wAj92p1rrGW/wB9/vP+w92p1onj1xLf8T/h/vj7sB1WvWMn3YDqpPXBj/X8c/7372B1WvXAn6/7D/fH3cDrVesZP+P+8+7AfLqtfTrGx/4j/X92A6rXrgT9f9h7sOq16xk2/wB9/X/b+706qT1iJ/N/9b/ff7D3enlTqpPXAn/ff776+9gdVPWMn8/0/wCR+7gfs6rU9Y2P++/339PdgB1XrGW/43/yP3cDqhyDTrHq/wBf6392A4daY9Yz7vTqlesZP+wt7sOtVoOsZP8Avvr7sMefVD1jJPP+x/23Nvd+q16xsf8Aif8Aez7v69aPWNibH6/776+7D06qT1wJ/wBt+Pdh9nVCafb1jJ9260esZP8Avv6Xv9fp7tTrVesZP/E/7zx/sfdwM56oeuB/pf3v5+fWq9cSf98Pp/vj7sOqHrGf98Pr+fdx1o9cD72Oq9cD/T6f77/e/ex1qvpx64/74/7fn3brR64n/fH6392HWvKvXH3vrXXvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//T3TNX9f8Affn+vuW6enWP1fn17V/X/ff7171Tr1evarf635/31ve6fPPXiePXer/in+w96p16vz66v/sf9697p8+vV671fXn/AHr36nXq9cb/API/e6Z68T16/wDvB/33+9e9U61Xrq/vdOvV661f77/Y/wCv73TrVeutX/Gj/sPfqder6ceur3P++t/vB97p1qvXEn/Wv/rfnn3YDr1fLriT78B1qvXWr/ff77/H3sDqteuJb3vrxPl1wLf8a/4r7sB1WvXEkjj/AFv96/3v3sDz61UdcSfdgOtE+p64Fh/vv98fe6daqOuGr/fc+7U9eqnriW/H+v8A8i/r72B59ar1jLf77/iPd6dVJ64E/wCHH5/Fvz+PdqdVJ64Fj/X/AHn/AHv3anWifLz6xlrf74n3YDrVeuBb/X/x/wB99T7tTqtePXAt/vv+Kf4e7AdVJ49Yy3++H++HuwHVSfLrgT9fz/sP9hf3YDqp49Yif99/xX3enVSesZPJ/wB9/tvdqYp1Xh1wY/778f6/192A4dVJ4dYyf99/h7uPTqp6xk/n/in+x/Puw6qesbN/vv8Aff4e7gceq+fWMn8/j/kX1/1vdh6U6rXrGT/t/dgP2dVP8+uBP1/r/vv9593HVCesZP1454/33+B97Az1ok9Yyf8Ainu4Hy6qT1jJ4/xP/G/d/wDB1Xzr1wPuw6qT1jJ92A6qc164H+n0P0/4n/ifdgOtHrGf95vz7sOq9cL/AOx/339PdqdaPXAn/ff8i/1vdh1XrgT/AL7j/invdOqk9cCbH/iPdutfPrje/wDh/vY/1ve6U6r1wP8Avv8Ab+7DrXXR9761117317r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//U3RdX+vb/AH3+w9y/T06x7r13q/xt9P8Abf71+feqU8uvV67uR/vv96/qPfqV6316/wDj/wARx73THWq9eBH0uf8Aef8AeOf8feuvV8+varf48f77/Y+/U8qder16/wBf9v8A43/4173Th16uOPXRb/EfX/b/APFPfqefl1qvXHV/j/vr+/AfLrdR169uP9vb3unWq9dav99+L/63v1OtV66J/wB9+fe6DrVeuJPH+v8Aj3unXq9cdX+Nv8fqB/X/AA92p1qvz64k/T/Yf7D34DrVeuJP++/3j/eve6daJz1xLf77/jRv9T7tTrVeuN/99/vj73TrVf2dcSf+K/8AFR/tvex/PrXXHV/sfp/vr/X6+7U6qT+zrGT/AI+7U61XriTb+v8Avv8AYfj3YDrXWMn/AFv97/r/AF92HVa164lvz/vv9h72B1XrGW/3r/ff7b3enWq9cNX+w/3j+n9Pe6dVJ64Fv99f+v8Aj7sB1WvWMn/ff737sB1X8sdcC3+9/wDE/wCHu9Oq+XWMt7tTrROOsZP++/3rj+vuwHVCeuBP++P/ABN/dgK9ar1jJ/2A/Jv/AL76+7inl1UnrGWP+2/2P+9+7AdVPWMk/wC++n/E+7AcOq/n1wJ/w+n493A4dVJI8+sbH/ff192A6qesZPP+8f776+7cOqHz64Mf9vxf/ff4e7U/Z1qvWMn3cDPDqvWMn/iv+xHu3z6qT1jJ/wAebn/W/wBf/be7dV64E/63u1Oqk9cCR/xv/eP8fdwOtHrH/vv99/j72OqnrgT9f8P6f8T/AE+nu4HWuuF/+Rf7373SuOqnyp1wJ/3jj3brVfn1xPvY6qeuBP8AsP8Aff631492HWs9cb/X/X/5H7t1o9cD/vvz731Xrr3vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/1d0C/uYqdY8V67v/AL7/AIj37r1evX/x/wB9x71Tr1evX97p16vXtX++/wB9/r+9U69X59ev79Tr1eur/T/ffX3unXq9ev8A77k/7z79Ty8+vV66v72B1qv7OutV/wCv++t73Q9er11q+v8AxP1+v+Hv1OtV66v/AIn/AI1/xPvYHp1omvXHVb8/778fm597pXrxPEddFv8Aff77/X97p1ot1xLf7b/ffn3unXuuJb/ffX/D3sDqpPXC/wDvv6j/AIj6e7U60Seur/T/AFv6/wC+/PvdOtV64Fv8f98P9697A60T1xLf71/X3YDrRPXEn+n4/P5/31/ewOq164FvdqdV6xluP9v7sB1rrgTz9fp/vre7U6qTXriT/tve6dar8+sZP++/1v8AePx7t1XrgW/4j6fnj/jXuwHlTrVSeuBb8f739fdh69Vr1jJ/pb/if99f3any6qT9vXAn6/n/AHx92A60eOOsZN/+J/33+w92HVa+vWMn/ff8b93A6rXrgT+f9592A8uq9Yyf8f8AffX3YD04dVJ8+sZP++/4n3eh6r1wv/vvr/xPu3+DqpPXAk/X/X/p/vh7twx1Wo6xE/n/AB/3j6/7f3YfZ1U9cCeP+Nf778e7D7OtdcD/AK4/3w/HPuwx1Umnl1wY/wC+/qR7uOq16xk/77j/AI17tT59V+3rgfpf/X/33+v7t1Uny6xnj3brVesZP+8H3bqtfn1xJ/2/+++nvf5460euBP8AxX/ff7H3anVfPh1wPu3Wj1xJ/pz9f9h/yL3sdVx+XXD+v+++v49260fl1xv/ALzfn/ff092611x97611737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//1tzrV/U3/wAP959zLTrHXrvV/vv8PfqcOvV69q/5H/vre/U69Xru/wDvf+H9T79Tr1evFh/vuePfqdeqaU69qH9f98P959+oetddX/33/FffqdWrj59dav8Aff4f0/33PvdOtV69q/3vn/W/Hv1OvdcdX++H+8+908+tV66v73TrVeuiw/3w9+p149dFuP8Aevx/yLn3sDPWq9cdX++/2P8AxPvdOvV661f1P++/rxx73TrRI/LriT/xH+8e9061X59cC1vdqdaJ64k/8U5HH/FPe6dVr1xJ/r/j73TrR64lvz/vuPdgPLrVeuBP/Ff+J97p1qvXAn/ff73+P6e7AdVr5dcb/wCw/wB8bfn3unWq+fWMn/ff717vTqp64k/776/4f0/HvdPLqtesd/8AYf77/eLe70611xLf776f197A4dVNOsZP++v/AL76e7da6xk/77/fX/PuwHVa9cGb/H3anVSeuBbj/fEX/wCJ92A+fWifXrGT/vvz/t7e7Up5Z6rXrgT/AK/++/2Hu4Hl1UnrGT/vv98OT7sOtV64E/77/fcf8j92A6oesZP/ABH5/wB8fx7sPXqp64E/0/5F/hb3YDy6qT1wJ4/2H++/p7sOqn59Yifr+P8AiD9Pr7vTrR64kjnj/ffT+vuwHVa/s6xk/wC+/wB8Pdv8HVeuB/439f8AW/4r72OtE/LrGT/j/re7jqtePXA+99V64E/77nj/AH1vdqdar69cSfx/vuPdgPPqv5dcPdutdcP99/vvx73TrRPXG/5/w/Fv6f0/HvfWjXrgf99/r/737t1onj1x976r173vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf//X3NdX9eOP+Rf7f3NNPTrHI9evx9ef99/j79T5dernr2r/AGI59+p+3rdfLrvV79T5derQdev/ALx/gT79Tr1eui39Pz/xX36n7OtdeLcf1/33+8+/U6311q/330/HP+Pv1OtV69q4v/xrj/eh73Tr1eutX0H++/4p79TrVePXWr/G1h+P+I97p1qvXHV/sPp73Tr1evarX97p1ony643/AB/vvx79TrWOuJP++/33HvdOtE9cb/X/AF/z/wAU97p1onrjf/ff7x7tTr1ePXEt/X/eP+Rf4e906rXrjfn/AA/3w97HWiR1xv8A8R/tvrf8H3anWieuGr/ff7x/gfe6dar889cSf99/vvz7t1omnXAn/ev6f73+fdqdV6xk3v8AX/ff8b92pw60SB1xJ/33++/1/e6dVJp1wJ/2F/8Ae/8AW92p1qvXAn6/7D/ef6e7U+XVSeuBP/G/9b8C3+t7tTiOqk164E/77/efdqenVT1jY/76/wBOf9f8+7D+XWq8euBP+9e7AdVPWMn+v++/1/e6DqteuBP+2+l/p/xrj3cDPWiesZP+P+v+P+N+7AdUr1wJ/wCK/n/Y+7Ada64E8fX+h/5F+B7sOOeq149Yyf8AH6e7fPqp64E/X/W/3kf7xx7vTPDHWj5Z64E/7e/14vx73Tqvn1wJ/wB492/LqpPWMn+n1P8Avv8Ae/dh5V60T69cCT+P8bcfX/iPdqevVTTrGT/vr+7Ada/PriT9P9e/u1Oq9cCfx/T/AFuLf8V92611wJv/AL7/AIr9PewOq9cD/t/+NX92HnnrXXEn3YDrR9euJ/3r8f8AIh/h72Oq9cf99x731rrr3vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691/9Dcvv8A8T/tvp/tvc206xvr68eu9X0/33+++vvVOvYp11f8/wCH+8f4e9063Xy671f8i/33+HvVOtV9evav99/vfv1OvV8j17V79TrdeutX++/41+Pe6der17Vb/ff7x79TrVeur+/U61Xrq/8Avv8AY+9069Xr17+/U68T1x1f77/ffi3vdOtHrom9/p9R9eP99f3unWq9cS3/ABq9v9v73Tr3XEtxz/sP99+fe6darmvXWq3597p1UnriW/33++/J97Az16vXAt/j+f8AffX3anWq/t64lv8AfH/fX97p1qvDriT/AMR73Qda64k+7U61Xrhf/H+v1+v+9H+nvdPOnVSfl1xJ/wAfpz/vv8fdqfLqtcdcL/77+nvYHWicdcCfr/h/vv8AevdqdVr1wJP5+vP+w/p/T3un7OtfPrhf/ivu9Oq164Fv9v8A6/vYHVf8HXAn6f77j/ifd6enWieuBPvYHVa9Yy3++/4rcX92A9OtE9cCeOf9b/fX92A6qadcCfdgPl1o9YywPu4HDqtfn1wJ/wAfx/jb+n5/w92A6r59cCfduqnrgfz/AK39Of8AfW97HWq56xsef+Re79a64E+7dUr1wJ/1+f8AjXI5P592GOtE9cSeOP8Aff7b+nvdOq9Yz/vf+w9260T1xJ/w/wB9b/H3anWuuBP+9/4f776+9gdV64E/X/ev99/j72OtV4564E/X3cDqp9euP+39761Xrje//Ffp+T/tve+q9cP94926911731rr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//R3KQf96/1v9Y+5wI6xsr12G/33+Pv1OvV/b17Vx/vv9v9Pfqdbr17V/vv99yPfqder16//E/4/wBf+Ke9U61Xr2r/AG3vdOvV661e/U68T14t/h+f+Kf7379TrdeutX++/H/FPr73TrVevFv68/7x/vr+/U61XrrV/wAb97p16vXWr/iP949+p1qo646ve6dar11e/PvdOvE9cNR/2/8AyPj3unWq9dX+v+P+x97p1qvXRP8AvX++/wB697p16v7OuF/99/vHuwH7eq164lv999f6W/2/vYHWq164kn+vH/FL/wCx97AHn1qvrx64kj6f7b/D8+7U6rXh1wJ97p1qvXEt7tThTrRPXAn/AB/P/Ff9t7sB1Unrhf8A4j3alK9aJ64E/wDI/wDbe9gdVqOuBP8Aj/vjf82492pWlOtE9cdXB/33+w/x97ofz6r1jJ/5Hb3YD06qT1wJ/P4/33/E+7Aft61XrgSP8ef99/T3YDrRI64E/wCP/Gv99f3anoOq164E8f1/w/H++t7tTqp64En/AH3+2/p7sAPM9aPWMn3aleq564E82/33+B92+fWj9vXAn/XP+9f776+7U9eq164k+7AZ6qSOsZP9f+N+7AefWq+h64E/8T/sOD/xX3sDPWj5DrgT7sOqHriSP999PewOvHrGT9D/AL76+7dV8z10T/vv+K3HuwHVeuBPvY611wP+H+24P+8fS3u3Wj9vXHg3/H+P++/1ve+HWuHXE/77/Y/4e9jrR64n3vrXXve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9Lck1f8V/339Pc6U6xpr17V79TrxPXtXvVOt/Lr2r6f0+v+v79TrVadd6v99/h79TrdeutXv1OvV661f77/AH1/e6fLr1evFv8Aeffqdar11q/5F78B1qvXtX+xHvdOvV661f4/4+/Ader1x1f77/b/AOt+Pe6fLr1eur/77/Y3/wBf3vrVeutX+3/330/p79TrVeuJP++/3wPu1OtV66J/33+PvdOtVyOuJb/e/wDkX+vf34DrVeuOr/ff71/j7tT161+fXEt/vv8AffX3unWq9cSf98T73TrXXEk/7H/evex1WvXAn+v++v8AX/ePdgD16vHriW/33+vf3ulft6rXrgT9f98B/vfu1OtV643+v+8f7Ac+7U6qT1wJ+v8AvV7/AI/3v3sDh16teuBb/e7+7AcK9Uz1wJ/3r/Y/77j3enWq564Mf99/t7/7wPewOtE9cC31/wAf6e7Dqp4ceuBPvfDrXHrgT/rW/NuD+PdgPXrVfTrgT/vv8f8AkXu1Oqnh1wJt7sB1XrGTz/xu3u1KDrXXC/8Avv6+7Dqp64k8f8U97Az1XrgSf9j+Lfn/AGPHu4H7OtdcCf6f6/8ArC/HvdOq9cSfdqdar1jJ/wB8f+Ke7f4eqn7cdcSf99/sD/vfvdD1rrhf/H/in4+nu3Wj1xJ97611xP8Arf48/wC+t7sOtdcD/vv+Ne9jqteuJ/43/wAUHvfWvLron3vrXXXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//09x4n/ePc708+sZ69ev+P99/t+Le/U69Xr2r/b+/U61Udd6v+N+/U63XHXgf96/rx/vHv1OvV69q/wB9f/W/P09+p1qvXWr68/77/fD36nXq8OutX/Ff98Pe6dernr2rgf0/33+29+oOvV661f8AED/iP9f36nXq9dFv99zx9P8AXt73TrVeutX+PvdOHWq9dauP6f0/x9+p16vkOuOon/W/3r3unWq/t661f77g/wC297A61X0646v97/3j/ife6dar10SLf63vwHWq9cb+7DrRPXG/+3v9Pe6fs69WvDrhq/2P/FP9v/X3amfn1Wvz66JH+P8Ar/7D3sCnWqnPXAn/AHj/AIj3YA9aPXEn/Yf74c2vf8+90PWuuBP4/wB9+P8AD+vuwHVan164k/77/in+w97Az1r/AAdcC3++/wBf3sLx611wLfn/AIp/h9fd+GK9ar1xJ+n4/wBv9P8AfH3sDqp64E/77/efdgKdV8qdcC3++/33+HvdOtE+Xn1wJt9P6n3YDqvqK564E/77/ffn3bHl1rrgTz/vPvdOteWOuDf8V+n++/x93HVa8euBPH++t9P+N+9gdV64k/72Pdhx611wuf6f1/3sj8/4e9gfPrRPXEn/AH3+xv7tTh1X7esZP5/33+HuwGetdcST/wAV92p1X/B1wPP+t/xv3sDrXXC/+P192HWjTrjf+nvdOq9cDf8AP+H+3PBI9261XHXXP++/43+Sfe+tE8euF/8Aifp/sP8AW9760eur+99a6697691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9TcY1XB/wCJ+n+9e57p1jHXru4/r71Tr3XtX+3/AN5/2HvdOt1z8uvav99/vj71Tr1evav969+p1qvp17V/sP8AfcX97A63XrrVf8f77/jXvVKefWq9ev8A4/05/wB8b8+9069XPXWr/ev9j/rfXjj36nXq9e1fk/6/++/P9PfqenWq8euOo3+p/wCI92oPz69Ude1f8T/vj79TrVeuN/8AffX3vyHXq9dav6f77/W/x9+pjrWOuN/99/xr/D3sDPy61X0HXRb8f77/AIn3unz69XrjqP8AxTn/AJFce9gdar1xvb/ff7H/AGF/e+tE466Lc3/334/3m/vYGOq564av99b3anXq9cS3+x/3j/be90/Z1rriT/T/AGP1/wAPrfn3unWq164k/wC93v8A77/X97GOq149cSfz/sf9h7tTrVeuBJH++4/3n3sDrVfn1wLf4X/3r/ef8Pd6daJ/Z1xJ/wCN/m/9ffgOq9cCfdqCnWq1+3riT/sD+f8AH/AH3bqp64X4/wBtb3ameqnrhf3b7OtdcSf+J/2PvYFOtV64E/7z/vP+8+7U61XrgTx+f+I/3r3anVc164E/776+9gdaPr1wJ4/33+vz/tvdgOqmnp1wP9f99/xXj3b161XriT73TrXXAk/76/8Axv3bqtf2dcT/AMb97HWqnrhf6/77/Yj/AGHu3VSeuN/e+vV64k/X+n++t73/AIetdcT9P9jb3YdV88dcD/T/AGH+297HXuPXXvfVfn117317r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r/1dxLV/T/AIp/vh7n6h6xgJ67v/vv8ffqcet169q/x/3349+p1rj16/8AvVvfqdbr8+vav+I9+p8uvV69q/4379Tr1evX/wBf/kfv1Pl1rrrV/r/7C/v1OvV+fXVx/vv6/wDGve6de69f+nP19+p69er11q/33+t/xHv1OtV66Lf7H/YH/ffT3unr16vXV+P9va/+P+vb6D3sDrVeur8/63++Hv1OtV8+uJPu1Pn1on9vXRb6f4e/Ux17hXrot/vv99x72AOtVp9nXAn/AHxuP999fewPLrVc9cb3v/vX/FOOfdqdar69cb/7z/vv8Le9gcOtV64k/wDG/ewMdaJ64lv96/33+8e7ADrXXG/+8/T/AI173Ty61XriT9eR/sf9hx73TqteHXAn8/4/77/ePewPLr1cY643/wB9/sbe7U6rXrhf/if99+be7fl1U0z1xv8A4/8AFf8AjR979OtE9cCx4/33+8/n3ag/PrVT1xJv/vv96/r72B8utE9cNVv999fdgM9Vr1wJ/wB99P8Ail7e9061WmPLrjf3anWq464E/T/evdh1qvXAn/Y/77j/AAP1976rXriT/vuP94/Pu3WvTrjf/fH3anVanrgT/sb/APG/+I97611xP1+vvfkcdarinXC5/wB9/wAV97p+3qvn1xJ92HWq9cef99/sfz73TrVfXrjf/ev8P9b3brXXG/8AxW3+8m/+29760fLro+9jrVf2dcfe+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9bcNv8A1/3v/eb+8gqdYu169q/33+8/8T71Trfn13fj+n++/wB49+A61X59dav99/sf+J9+p1uvXr/8a/1x/sLe/U63Xr2rn/ffj/b/ANffgOtVx17V/wARb+nvdOvV/Z11f/kZ/wB9/wAV9+p16uOvX/1v9h9P+Ke/UHWvXrq//Gv8OPfsdaHXV/oT/r/j3un7Ovde1e/U69X0646v+I5/2HvdOtVpx661e9gdeJ66LfX/AG3++497p+3rVeuOr/ffj/b/AI97p6darx64k/X/AIj/AJF73Tr1fPrrV72B1WvXG/8Avv8AiT73TrX+HriW5t72B6de49cSf999f+R397A6qePXEn/bf4/U/wCx/Pu1OtVpTriT9f8AfD/eP6e9jrRP7euJPHvdPPr1euN/8R+Of99b8e99Vr59cL3H0/33+9+7AdarQnPXHV/xX3ulOtHrjf8Apf3sD5dVr1w1f77/AH3192ofz60fQdcSf+Nf0v72B69ar1wJ/wBh/vv+Ne7AevWieuJP++/3j3YDHVcdcL/0/wB6/wAf9f6+9060T1xJ/wB9/h/vPuw6r1wJ/wBt/vv9492p1qvXEn/H3vrXXAn/AF/xz/vv6e9gdar1xJ/33+2/r9fdgOtE9cSf+N/6/vdOtdcSfex1X7OPXEm3++/3n/ePdgOtcfPriT/vv99x72B1odcT9fe+vdcf99/vPvfVeuve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//X3B9V/wDff74e8hadYtV69q9+p1uvz67v+f8Aff7b8c+/U6917V/vXv1Pljr1fPr1/wDH36nXq169q/33/I/fgMcOvV661f61vr/xT+nv1OvV69qH++/3n34Dr1fPrq/++t79TrVR17V9f95/1vrf+vvdOvV661f77/b/AOx9+KnrVeutX+8/T/Y+/U6910W/1v8Affg/6/vdOtV643+v++/w/wB792p16vXV/wDff0/3x9+p1qvXRP8AvP497p1qvXV/e6Z61Xh1xJ597p1qvXEn/H/in+v9Pe6enXq9dE/77/W/5F72B1qvXC/+8+9061XrrUf95/31/e6da64E/wDFOD73T5Z6rX9vXRP+9f74f192p16vXAn/AIqP9j73StOq164k/wCx97A69Xrjf3YDh1U48uuF/wDff77j3sDrXXRP+3v/AIf8R7sBw60T1wJ/3x597A60T1xJ/wBj/vf++v73QdVr1wJ/x/43/wAR9fdqfLrXXEn/AH3+H++Huw61Xrh73T9vWq9cb/7b3vy6rXriT/rj6f77j3anWj5evXEn+v8Ar/778+99a4cOuF/9597611xv/vv98fex1rrq/P8Avv8AG3492p1o+XXD/fD6f74+99a64/8AGv8AjXvfWq+vXXvfWuuve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9DcCv8A77/eePeRNOsWK9e1f8Qfeqda69c/4D/eP8f959+p1uvmD17V/vuP9v8A6496p59erQH0671cc/8AFD/vVve6cKDr1c8c9dX/AN7t/S3/ABX36mevde1f77/eOPfqder11q/P+N/+N+/U4evWq9eJ/wCN8e/Adbrx661fj8f77/X97oOtV69q/wB9/wAj/HvdOtV643/x/wBf36nXq9e1f48c/T/X97p16vXV/wDY/wDEf4/7f3ulOtV/b11q9+pw61X9nXEk/n/ebcX+n9Pe6deJHl1x1f7cn/ff61/e6daJr54661X97p1qvp10T73TrVa9cb/77/W97A61Xrjq4H+9/wDFf8Pe6eXXjx+XXHUf+I/3w97pnqtaHA64lv8Aff7G9vz7sB1rriT/AL78f7x/j79Q9ePDriT/AK30+v8Avh7sB1UnriT9Lf4/63H4/HvdMnrVeuN7/wC+5/3v+g97oOtdcCfdh1omvXG/++/2HvdOtdcSf9fn/H/ffn3YenWq9cb8C3P++/r/AEHvYHVSeuN/r/vv+Ke9gdePXAn/AH1ve6fPqvXG/wDvrf7b+v197p1r/B1xJtz/ALx/vv6e7U6169cSf99/sP8AiPewPXqvXEn6/wC9f6/u1Mder1xv73TrXXH/AHk/j/kQt73/AIOtVr1xN/8AY/jj/eve+tVHCvXEn/fcfgf09761w48Ouj+f6e99a6697691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//R2/NXvIugr1irUevXd/6+/U9OvV+XXr/7D34j59e69f8A33+29+p17V17V/vJHvdOvV69c/6w/wB9/tveqdbr5deBH++Pv1OtV66v/wAb5597p59er6de1f776/049+p+3r1euiTbj/e/fvX161X169qH++/3x97p16vr1xv/AL7/AAv+B+Dx72B16o661f4/77j/AA9+px61XPXr/wCv9f8Aevfqder+zrjf/iPe+tE566v/AL7/AG3vYHWv8PXRb83/ANf3sA9erx64lvr+bf7C3/FfewK9aOOuiT/W3++/2A9+HWq9cdX+t9f99/h7tTrVanrjfm/+v/tvewK9a9OuOr/b/wC+/wCK+9060T1xv/xPvdOtV643/wAf9b+n+w97p8uvddX/ANf/AF/qeP8AYH6e99V8+uJP++H/ABH+PvdKeXWq164k+7U8utV64k3H+wv/AL7j/D3vOM9ar+zrgW/r/vH+8e909OtcM9cb/wDFbf0/3x92p1rriT/vv+R+99V66J97oevdcL/77n+tve6daJz11f8A43+f6/1H597p1XhTrgT7tTrxPXG/vfWuuN/e6dar1xJ/33J/1r+906111f6f77/ifr731rriT/tvp/yP3brX2nrj791rr3vfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//S2+NR45/339PeR1M1p1il11f/AG3vdPlnr1eu7/776f4/196pTrdc9e1f77j/AHwPvYGetdev/h/xv36nW69dX/HH+8/778+/U60T17V/xv8A3m3+HvVOt/4Ovavex1qvXr/77/fW9+A69XrrUf8AfH/fc+/U61165/2/++/4j34AenXq9dave6der8uuif8Aff776e906110T/vv+K/W1vfuvV4dcdX/ACL/AGH+9e7U4da66J+p/wB9yPr7917rot9bf74/jj3ulfLrRPkeuN/dqdar10SPx/rfX/fW9+p1rrjf/W97HWq9cdX+3/17+90z17ron8fQf7Y+9gda+zrjf6f776/8RY+/U611xv8A76592pTrVeuif95/1/r72B6cOtdcSf8AfD/kXvY68euBP+++nP8Avh73jqvXV/z+b/4/0+v197p1rriT/vf/ABPu1OtdcSf999Pe6de64kj3sD0PWuuJP/G/9iPp/sfe+qk9cb/778e9060a/n11f3vrR+3rjf8A33+H+9e9061Xrgf+RX/4i/u3Wgfnjron/ef9h/T3sda64/77/H/b/wCw9768fQdcb/77+nvfWuuvfutde97691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//09vLV+L2/wB9/jf3klTrE+vXd+fr79T9vW6466DcD/Yf7z79Tr1evav99/vv8PfqcOvV67v/AL69v94PvWnr1fLrrV/vf++497p1qvXtX+x4/wAffiOt169f/if9h/vPv1OtVPXr/X/D/iOOffiOvE1661f76/8Are/U6911f/ff71fj3sDrxPXtX+++n+w9+p1queuJN/8Ain++t72BxPXq9dEj36h4efWq9e1f77/bC/vdP2de66v/AI+99a643/H5/wCI9761X5ddX/5Ef99f36nWj1x1f7H/AH39ePex9vXq9dXv/wAU/wCKe90PWuuOr/e/e6der69dX97p1qvXEn/WPvYHVagdcSSfp/h73Tr1fXrq/wCPr/rf7f8A3k+99aPr1xv/AL7/AHr3unHrR49cb/j3vr1ePXG/u1Oq18uurj8f763+8e/U8+tdcb8fj+n+x97p1onrgTf3anXuur/4/j/fD3vqteuJP++/4n3sDrVeur/j/D6f4+99er1xP++vf/fXv731onPXRP8Avv8Aeufe+tceuBP+9W/23+HvfWq066v731rrr3vr3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//U27b+8ladYm168D/Xn36np16vXr/4/wDI/fqder13f8f0/wCK+9Uz16vHr1/9t73TrdevXt+T/vv+Ke/U61Xj11f37r359dav6/77/D36h69Xr1/99/vvx79Ty69Xr1/96/33+9+/Uz16vXV/99/xHvdOtV8+uieL/wC+/wBsfe6Dh16vXr/05/2P++v711quaHrrV/r/AO+v9PdqefXq9dXt/sf6/wDGrn6e/U61X9vXV/r/AI/778+90H5der10W+n++/41x79TrXn11f8AP+P/ACPn3sD59er1xv72B1X/AA9cb/77/ffj3sDrxPXV7/73/vufewKder11q/3rn8f8T73T061XzHXEn/bW/wB8Pe6fLrVeJ66J/wCK/j/X/p+ffqV61X59cb/1/HvfWuuN7f4f4/77+nvfXj1xvyf99b/efdqHqteuN/8AW/x/3j3vr3XV/wDif6f054976110T/sOfz9f969+p69arjrjf/ff7x7tTrXXV7/8V9+/LrXXH/ebfT3vrVeuJPP++t/vHPu1OteXXG/+t/T/AH3097p17/D11f8A24/2P++59+p1qvXV/e+tdde99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6/9Xbovwf8Pp/rfT/AG3vJinWJVeu7/Xn/be/U63Xr1/8P99+OPfqefXq9euf9f3qnWq+vXr/AO2P+w/xv9f6e9gAfb1uueur/wCP+wH+++vv1OtV4dd3/wCJ/wB9z/X37rdeugf99/vH09+p14nr1/r+Ofx/xs/19+pw61+XXV/8P62/43/r+9069Wnn17V/jf8Ar/vvx79Tr2ry661f8UPPvwHWq+nHrq9vz/vv+KH36nXifTrq/vdM9eJ4+nXWr/ff7x+fe6dar11f36nXq9dX/wB9/h73TrXXWr3unWq9dX/330/3r+nHv1OvfPz64k/765+tv6j+nvYHWq8Our/W3/Ffe+tfb1xv/wAR/vv8fe+tfn16/vYHXuHn1xv/AL7/AIj+vvdOtZ643/PH+++v+297p1qp66uef9t/vv8AYe99ernrr/eP9t/vP+x9+61XPHrje3+9/wCw+vvfWjxr1xJ9261WnXRP+39+p+zrXXH/AH3++/rf3unXvPj1xJ/2H++P+v73TquOur/8bP8Ahf8A1r+7de4ddE/7Y/jj/D/be/daPXEn3vrXXXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r/1tuTV/sf9795N06xIr+zr1/99/T37rdfXr1/esHr1evavfqdar16/wDj/W3v1PXrxPoevX/33P8AxHv3+HrdfXr1/wDbf77/AHj36nWq9dX9+p1uvXr/AO+/H++t731qvXV/fqcevV67v79Q/l16vDrq/wDvv99/h73T9nWieur/AO+/4r79SnWq9dX/AMf99f8A2HHvfWyRnriT/vv9vx+R79T9nWq/Pr2q9/8AeP8AkV/6+908utHrq/8Avv8Ainvw69X9nXV/6/8AE/7f3unl1qv7eur/AOP/ABr8e9j7OvV64k+99ar10T73T9vXuPnjron/AH3+ta/+9+/U6rXh11e/9Lf778e99er889cSf68f763P+PHvdOtVH59dX/r/AL7/AG3vfXq066v/AI/0/wB5+vvfWq8euJP+9+9060eur+/da643/wB99f8AYe9061Xrr/WNyP8AfH3vr1f2ddX+n++/17Xtb3vrVeuJ/wBf3sfZ16vXRP8Avv8AfD3vrX28euvfutdde99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//9fbgv8A8i/3v3k7TzHWI3+Dr17X/wBj/vH/ABr36nl16vDrq/8AxX/bn/Ye/U69Xy67vb/ff8b9669X59ev9P8AjV72/HPvdOvevXr/AOx4/qPfqder11q/33++v79TrxPHr1/99z/j/gffqder14E/n+n+9j3unXq9dX/339f959+PWq169f8A239Pp+eePfqder6ceutX++/H/Ive6deJ/Z17V/Q/1/2w/p79THDrVeutXv1Ovdcb/wDFP+J/3v3uh9OvV69f/Hj6f09+61Xrq/8Avv8AkfvdOvHron/ivHvYHWj10Tb+nv3Xq9dav9t/rfT63/2J97p1rron/Xv/ALaw/Nj72OtV643/ABfj/fc+99ex11f+p/Nv9t/vV/8AW9+61Xrq/wDtvx/tx73TrR66J/3w97p17rq/+w/31vfqda643/P9P+Nf8V97p17/AAddX+v+v/xH9Pe/TrR9euN/96/330497p17rq/+P+v/AMU+h97p1Xieur/8RwP9f/ePr79149dX+vvdOtdde99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/0Nty/wDvrfT/AHx95P06xD68Db/Yf77/AG/vfHrdevA/8j/2PP8Ar+/Y69/g69cX/rx/rfn3oDr1T16/+P8AsPzb8W/x9769Xr17fj/ex/xT36nl17/B11e9/rf/AIn/AIp79Tr1evX/AD/vH++Pv1OtV66v7314Hr1/99/vvr71TrdevX97p1qp66v/AL7/AIn36nXuur/09+p1qtevX97p16vXV/8Aff74e/eXXuur3/33+w9+p1r/AA9dX/3x/B97p17rrji3H+x/Pvec9a69q/33++B49+p1o0rnrjf/AH1/e6der69eJ/4r/vr8e9068Tn5dcT79Tr1a9dE2/3v3uletddX9761UddE/wC+P497p1r5ddXH++/r/vHv1OvdcSQP99fi39fe6V61Xz66uP8Ajf8AvH9Pe6de9Oujzz/vuP8AYce/da9eur+99a6697691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//0dte/wDj/vXvKKnWINevX/33/Ivfqdbrw69f/ff7b34jr2eu7/77/jX19+p16vz69f370x14nrq/+9+/U69Xr1/fuvV68Cf6f8T79Tr3Xr/8Tb/effutV66J/wB9/tx/j738uvevXr/77/fX+nv1DXr3+Hrq/H/FPfqHrR69fn6/m/8AsOD79Trdeur/AOw/w+nvdOtV+fXV/wDbcf8AEe/U/b16vXr/AOv/AL6/+x+vvdOvdev/ALG30/2F/fqda8+uJP8AyP8Ar/h73TrXr11f36nXieuif+Ke99ar11f3vr1c9dX/ANt/vrf1F7+/da66v/yP+vH/ABr3vrx66v8A7z/xP/Gve+tVPXH/AHn+v1P+v73175dev/r/APEc/wCt9LX9+6110T7317rq/v1OtV+XXXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/0ttO/wDyP8/0/wAf6fj3lLTrECv7eu7/AE/5F9f+R+9U69Xj17n/AA/33/Ee/der16/+8/8AFffvn16vXr/jn8f77+vv3z69X9nXV/8Aff8AFffuvde1f8j/ANh+f9f3unXq9evx/vvx/T3rr3Xr83/4oOPp/sPe6daJ66v/AL7/AHj+t/fvn1uvXr/74/7H+n9Pfqda8uvX/wCR/wCPP+Pv1OvV66J4t/sP9vz7359aPXr/AO+/3309+p17166v7316vXV/fqde69f3unWqjrjf/ff7Dn+l/fqder16/wDvv99z791qvz66Jvx/vX++/r73TrfXr/8AIr/19+p1U+vXG5/H++v/AMj9769Xrr/fA3A9+69Xron/AIn/AHn6/wC39761jrq/vfXq/s69791rHkOuve+vde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//T20L/AOP++/5H7ynp1h916/8Avv8AfH/D36nXuvX/AN696p16vXr+/der16/v3XuvA+99eqevX9+69Xr1/fqde66v/vv9f36nWuvX9+6316/v3Xuuife6da/wdev/AL7/AH1/fqde9eur82/23/G/fuvefXXP+x/334+nveOtV9OvX/24v/vrf19+p1vh9nXr3/r+ef8Afce/U60euvx/r/7z/h731r8+uv8AX5+n++Hv3Xq+fXV/8f6/77+o97p1qvXQP++/3w9+p149e976959dX9+60Tx69f37r3XXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//9TbMB/x/wB9/r+8qadYeVp13f8AP/I/96+nvVOt9e+n+H++/wBh79SvWuvX/wBh+OPp/t/8Pe6db69f36nXuvXP9P8Aefeutfn16/8AvuP9j7917rq//E3/AORe906916/+9fX+p/P9Le/f4evdev8A4/6/H/Ivfuvdev8An/itv+Ke/U9OvV8uvXP++txyP959+68SPy66v/vrn/D/AHr3unWuvX/H9P6f763v1OvV66v/AMa/3r3unXuuiePp/vv8f9f36nXvKteur/7179TrVaceu7/1H/I/6/63v3XjXrq/++/p7317rq//ABNvfutdde99e697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/9XbKv8An8W/3w95VU8usOuvf8i/I/2/+39+6316/wDvh9fe6de69f8A1z/vv+N+9de/wdev9f8AjXP+x/HHv3p17PXr/wCP5H/FL/7b36nXq569c/4/48n/AHr36nXvz69f/jf/ABH+3t/sPfqde66v/wAT/T8fTj3vr3Xr8/8AIvrx/sPfqdez16/9f6+/U619nXif+K3+v/Ee/U69+fXr/wC8f8V+v09+p17rq/8Avv8AG3PvfWs9de/de69f37r3XXvfXuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/1tsi5/w/33+H+x95WU6w5/Prq/8Avv8AkR9+p17r1/8Aff7z79TrfXr/AF/33+++nv1OvV+XXr+/daPXr/7H/inv3XuvX/1v6c+/U63w4de9+61Xr1/fuvV69791uvXXv3Wq9e97691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9fbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9DbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9HbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9LbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9PbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9TbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9XbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9bbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9fbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9DbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9HbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9LbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9PbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9TbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9XbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9bbG95W9Yc9e9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//9k="

/***/ }),
/* 66 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 66;

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = [{"name":"collisions","type":"tiles","active":true,"visible":true,"blackout":0,"zIndex":10,"parallax":0,"zType":null},{"name":"front-elements-2","type":"elements","active":false,"visible":true,"blackout":0.3,"zIndex":9,"parallax":0,"zType":"front-2"},{"name":"front-elements","type":"elements","active":false,"visible":true,"blackout":0.3,"zIndex":8,"parallax":0,"zType":"front"},{"name":"characters","type":"characters","active":false,"visible":true,"blackout":0,"zIndex":7,"parallax":0,"zType":null},{"name":"transport","type":"transport","active":false,"visible":true,"blackout":0,"zIndex":6,"parallax":0,"zType":null},{"name":"middle-elements","type":"elements","active":false,"visible":true,"blackout":0,"zIndex":5,"parallax":0,"zType":"middle"},{"name":"back-elements","type":"elements","active":false,"visible":true,"blackout":-0.3,"zIndex":4,"parallax":0.1,"zType":"back"},{"name":"back-elements-2","type":"elements","active":false,"visible":true,"blackout":-0.2,"zIndex":3,"parallax":0.2,"zType":"back-2"},{"name":"clouds","type":"elements","active":false,"visible":true,"blackout":0,"zIndex":0,"parallax":0,"zType":null},{"name":"background","type":"elements","active":false,"visible":true,"blackout":-0.5,"zIndex":0,"parallax":0,"zType":null}]

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = {"data":{"layers":[{"name":"background","type":"elements","zIndex":0,"items":[],"parallax":0,"zType":null},{"name":"clouds","type":"elements","zIndex":1,"items":[],"parallax":0,"zType":null},{"name":"back-elements-2","type":"elements","zIndex":3,"items":[{"name":"platform_4","position":{"x":533.3,"y":1919.7}},{"name":"platform_4","position":{"x":623.3,"y":1856.1}},{"name":"platform_4","position":{"x":713.3,"y":1893.3}},{"name":"platform_4","position":{"x":829.7,"y":1817.7}},{"name":"platform_4","position":{"x":871.7,"y":1911.3}},{"name":"platform_4","position":{"x":734.9,"y":1931.7}},{"name":"tree","position":{"x":789.4,"y":1337.3}},{"name":"platform_4","position":{"x":1710.5,"y":1833.3}},{"name":"platform_4","position":{"x":1792.1,"y":1778.1}},{"name":"platform_4","position":{"x":1906.1,"y":1742.1}},{"name":"platform_4","position":{"x":2124.5,"y":1690.5}},{"name":"platform_4","position":{"x":2099.3,"y":1817.7}},{"name":"tree","position":{"x":2078.2,"y":1336.1}},{"name":"tree","position":{"x":1707.2,"y":1300.7}},{"name":"platform_4","position":{"x":3073.5,"y":1753.9}},{"name":"platform_4","position":{"x":3176.7,"y":1695.1}},{"name":"platform_4","position":{"x":3240.3,"y":1750.3}},{"name":"platform_4","position":{"x":2989.5,"y":1729.9}},{"name":"tree","position":{"x":2955.2,"y":1244.7}},{"name":"platform_4","position":{"x":3402.3,"y":1767.1}},{"name":"tree","position":{"x":3346.4,"y":1286.7}},{"name":"platform_4","position":{"x":3431.1,"y":1725.1}},{"name":"platform_4","position":{"x":3558.3,"y":1704.7}},{"name":"platform_4","position":{"x":3651.9,"y":1671.1}},{"name":"platform_4","position":{"x":3737.1,"y":1617.1}},{"name":"platform_4","position":{"x":3753.9,"y":1701.1}},{"name":"tree","position":{"x":3706.4,"y":1220.7}}],"parallax":0.2,"zType":"back-2"},{"name":"back-elements","type":"elements","zIndex":4,"items":[{"name":"platform_4","position":{"x":415.15,"y":1849.05}},{"name":"tree","position":{"x":376.45,"y":1397.45}},{"name":"platform_4","position":{"x":1755.65,"y":1945.85}},{"name":"platform_4","position":{"x":1903.05,"y":1857.85}},{"name":"platform_4","position":{"x":2002.05,"y":1803.95}},{"name":"platform_4","position":{"x":1932.75,"y":1825.95}},{"name":"platform_4","position":{"x":1917.35,"y":1981.05}},{"name":"platform_4","position":{"x":1774.35,"y":1989.85}},{"name":"platform_4","position":{"x":1806.15,"y":1772.75}},{"name":"platform_4","position":{"x":1675.25,"y":1873.95}},{"name":"platform_4","position":{"x":2049.25,"y":1798.05}},{"name":"platform_4","position":{"x":2762.05,"y":1698.25}},{"name":"platform_4","position":{"x":2850.05,"y":1675.15}},{"name":"platform_4","position":{"x":2935.85,"y":1733.45}},{"name":"tree","position":{"x":2804.35,"y":1220.95}},{"name":"platform_4","position":{"x":3557.65,"y":1740.95}},{"name":"platform_4","position":{"x":3676.45,"y":1754.15}}],"parallax":0.1,"zType":"back"},{"name":"middle-elements","type":"elements","zIndex":5,"items":[{"name":"platform_1","position":{"x":-192,"y":1897.5}},{"name":"platform_1","position":{"x":42,"y":1897.5}},{"name":"platform_1","position":{"x":276,"y":1897.5}},{"name":"platform_1","position":{"x":510,"y":1897.5}},{"name":"platform_1","position":{"x":744,"y":1897.5}},{"name":"platform_1","position":{"x":978,"y":1897.5}},{"name":"platform_1","position":{"x":1212,"y":1897.5}},{"name":"platform_1","position":{"x":1446,"y":1897.5}},{"name":"platform_1","position":{"x":-426,"y":1897.5}},{"name":"platform_1","position":{"x":-660,"y":1897.5}},{"name":"platform_1","position":{"x":-894,"y":1897.5}},{"name":"tree","position":{"x":-118.5,"y":1493}},{"name":"wood-bridge-barrier-1","position":{"x":599,"y":1850}},{"name":"wood-bridge-barrier-2","position":{"x":649,"y":1850}},{"name":"wood-bridge-barrier-2","position":{"x":729,"y":1850}},{"name":"wood-bridge-barrier-2","position":{"x":809,"y":1850}},{"name":"wood-bridge-barrier-2","position":{"x":889,"y":1850}},{"name":"wood-bridge-barrier-2","position":{"x":969,"y":1850}},{"name":"wood-bridge-barrier-2","position":{"x":1049,"y":1850}},{"name":"wood-bridge-barrier-3","position":{"x":1129,"y":1850}},{"name":"platform_1","position":{"x":1448,"y":1909.5}},{"name":"platform_4","position":{"x":1664,"y":1969}},{"name":"platform_4","position":{"x":1929,"y":1704}},{"name":"platform_4","position":{"x":1758,"y":1817}},{"name":"wood-bridge-1","position":{"x":2044,"y":1688.5}},{"name":"wood-bridge-2","position":{"x":2244,"y":1688.5}},{"name":"wood-bridge-2","position":{"x":2419,"y":1688.5}},{"name":"platform_1","position":{"x":2937,"y":1690.5}},{"name":"wood-bridge-2","position":{"x":2594,"y":1688.5}},{"name":"wood-bridge-3","position":{"x":2769,"y":1688.5}},{"name":"platform_1","position":{"x":3171,"y":1690.5}},{"name":"platform_1","position":{"x":3405,"y":1690.5}},{"name":"wood-bridge-barrier-1","position":{"x":2074,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2124,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2204,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2284,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2364,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2444,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2524,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2604,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2684,"y":1625}},{"name":"wood-bridge-barrier-2","position":{"x":2764,"y":1625}},{"name":"wood-bridge-barrier-3","position":{"x":2844,"y":1625}},{"name":"platform_4","position":{"x":3626,"y":1642}},{"name":"tree","position":{"x":3617.5,"y":1218}}],"parallax":0,"zType":"middle"},{"name":"front-elements","type":"elements","zIndex":8,"items":[{"name":"platform_1","position":{"x":-29,"y":1909.5}},{"name":"platform_1","position":{"x":205,"y":1909.5}},{"name":"platform_1","position":{"x":439,"y":1909.5}},{"name":"platform_1","position":{"x":673,"y":1909.5}},{"name":"platform_1","position":{"x":907,"y":1909.5}},{"name":"platform_1","position":{"x":1141,"y":1909.5}},{"name":"platform_1","position":{"x":1375,"y":1909.5}},{"name":"platform_1","position":{"x":-263,"y":1909.5}},{"name":"platform_1","position":{"x":-497,"y":1909.5}},{"name":"platform_1","position":{"x":-731,"y":1909.5}},{"name":"platform_1","position":{"x":-965,"y":1909.5}},{"name":"platform_1","position":{"x":2930,"y":1704.5}},{"name":"platform_1","position":{"x":3164,"y":1704.5}},{"name":"platform_1","position":{"x":3398,"y":1704.5}},{"name":"wood-bridge-barrier-1","position":{"x":2067,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2117,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2197,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2277,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2357,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2437,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2517,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2597,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2677,"y":1631}},{"name":"wood-bridge-barrier-2","position":{"x":2757,"y":1631}},{"name":"wood-bridge-barrier-3","position":{"x":2837,"y":1631}}],"parallax":0,"zType":"front"},{"name":"front-elements-2","type":"elements","zIndex":9,"items":[{"name":"platform_4","position":{"x":1577,"y":1923}},{"name":"platform_4","position":{"x":1494,"y":1966}},{"name":"platform_4","position":{"x":1628,"y":1981}}],"parallax":0,"zType":"front-2"},{"name":"collisions","type":"tiles","zIndex":10,"items":[["00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|00","00|01"],["00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01","00|01"]],"parallax":0,"zType":null}]}}

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = {"player":{"framesAmount":13,"frameWidth":64,"frameHeight":64,"image":"images/player2.png","animations":{"runRight":{"framesAmount":11,"index":0,"speed":16},"runLeft":{"framesAmount":11,"index":1,"speed":16},"rightAndBrake":{"framesAmount":11,"index":2,"speed":16},"leftAndBrake":{"framesAmount":11,"index":3,"speed":16},"standRight":{"framesAmount":11,"index":4,"speed":12},"standLeft":{"framesAmount":11,"index":5,"speed":12},"walkRight":{"framesAmount":13,"index":6,"speed":20},"walkLeft":{"framesAmount":13,"index":7,"speed":20},"jumpRight":{"framesAmount":6,"index":8,"speed":24},"jumpLeft":{"framesAmount":1,"index":9,"speed":24},"beforeJumpRight":{"framesAmount":11,"index":10,"speed":32},"beforeJumpRight_2":{"framesAmount":10,"index":11,"speed":24},"beforeJumpLeft":{"framesAmount":11,"index":12,"speed":32},"beforeJumpLeft_2":{"framesAmount":10,"index":13,"speed":24},"damageRight":{"framesAmount":6,"index":14,"speed":12},"damageRight_2":{"framesAmount":6,"index":15,"speed":16},"damageLeft":{"framesAmount":6,"index":16,"speed":12},"damageLeft_2":{"framesAmount":6,"index":17,"speed":16}}},"cactus":{"framesAmount":13,"frameWidth":45,"frameHeight":45,"image":"images/cactus.png","animations":{"standLeft":{"framesAmount":11,"index":0,"speed":12},"standRight":{"framesAmount":11,"index":0,"speed":12},"damageLeft":{"framesAmount":5,"index":1,"speed":12},"damageRight":{"framesAmount":5,"index":1,"speed":12},"damageLeft_2":{"framesAmount":5,"index":3,"speed":12},"damageRight_2":{"framesAmount":5,"index":3,"speed":12}}},"oldWoman":{"frameWidth":48,"frameHeight":48,"image":"images/old_woman.png","animations":{"walkRight":{"framesAmount":11,"index":0,"speed":12},"walkLeft":{"framesAmount":11,"index":1,"speed":12},"dieLeft":{"framesAmount":13,"index":4,"speed":24},"dieRight":{"framesAmount":13,"index":5,"speed":24},"lieLeft":{"framesAmount":1,"index":6,"speed":1},"lieRight":{"framesAmount":1,"index":7,"speed":1},"agressiveLeft":{"framesAmount":6,"index":8,"speed":12},"agressiveRight":{"framesAmount":6,"index":9,"speed":12},"shootLeft":{"framesAmount":11,"index":10,"speed":12},"shootRight":{"framesAmount":11,"index":11,"speed":12}}},"hedgehog":{"frameWidth":55,"frameHeight":35,"image":"images/hedgehog.png","animations":{"walkLeft":{"framesAmount":11,"index":0,"speed":24},"walkRight":{"framesAmount":11,"index":1,"speed":24}}}}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
module.exports = __webpack_require__(17);


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map
/*!                                                              
 * LeapJS v0.6.4                                                  
 * http://github.com/leapmotion/leapjs/                                        
 *                                                                             
 * Copyright 2013 LeapMotion, Inc. and other contributors                      
 * Released under the Apache-2.0 license                                     
 * http://github.com/leapmotion/leapjs/blob/master/LICENSE.txt                 
 */
! function(t, e, n)
{
	function i(n, o)
	{
		if (!e[n])
		{
			if (!t[n])
			{
				var s = "function" == typeof require && require;
				if (!o && s) return s(n, !0);
				if (r) return r(n, !0);
				throw new Error("Cannot find module '" + n + "'")
			}
			var a = e[n] = {
				exports:
				{}
			};
			t[n][0].call(a.exports, function(e)
			{
				var r = t[n][1][e];
				return i(r ? r : e)
			}, a, a.exports)
		}
		return e[n].exports
	}
	for (var r = "function" == typeof require && require, o = 0; o < n.length; o++) i(n[o]);
	return i
}(
{
	1: [function(t, e)
	{
		var n = (t("./pointable"), t("gl-matrix")),
			i = n.vec3,
			r = n.mat3,
			o = n.mat4,
			s = (t("underscore"), e.exports = function(t, e)
			{
				this.finger = t, this._center = null, this._matrix = null, this.type = e.type, this.prevJoint = e.prevJoint, this.nextJoint = e.nextJoint, this.width = e.width;
				var n = new Array(3);
				i.sub(n, e.nextJoint, e.prevJoint), this.length = i.length(n), this.basis = e.basis
			});
		s.prototype.left = function()
		{
			return this._left ? this._left : (this._left = r.determinant(this.basis[0].concat(this.basis[1]).concat(this.basis[2])) < 0, this._left)
		}, s.prototype.matrix = function()
		{
			if (this._matrix) return this._matrix;
			var t = this.basis,
				e = this._matrix = o.create();
			return e[0] = t[0][0], e[1] = t[0][1], e[2] = t[0][2], e[4] = t[1][0], e[5] = t[1][1], e[6] = t[1][2], e[8] = t[2][0], e[9] = t[2][1], e[10] = t[2][2], e[3] = this.center()[0], e[7] = this.center()[1], e[11] = this.center()[2], this.left() && (e[0] *= -1, e[1] *= -1, e[2] *= -1), this._matrix
		}, s.prototype.lerp = function(t, e)
		{
			i.lerp(t, this.prevJoint, this.nextJoint, e)
		}, s.prototype.center = function()
		{
			if (this._center) return this._center;
			var t = i.create();
			return this.lerp(t, .5), this._center = t, t
		}, s.prototype.direction = function()
		{
			return [-1 * this.basis[2][0], -1 * this.basis[2][1], -1 * this.basis[2][2]]
		}
	},
	{
		"./pointable": 14,
		"gl-matrix": 23,
		underscore: 24
	}],
	2: [function(t, e)
	{
		var n = e.exports = function(t)
		{
			this.pos = 0, this._buf = [], this.size = t
		};
		n.prototype.get = function(t)
		{
			return void 0 == t && (t = 0), t >= this.size ? void 0 : t >= this._buf.length ? void 0 : this._buf[(this.pos - t - 1) % this.size]
		}, n.prototype.push = function(t)
		{
			return this._buf[this.pos % this.size] = t, this.pos++
		}
	},
	{}],
	3: [function(t, e)
	{
		var n = t("../protocol").chooseProtocol,
			i = t("events").EventEmitter,
			r = t("underscore"),
			o = e.exports = function(t)
			{
				this.opts = r.defaults(t ||
				{},
				{
					host: "127.0.0.1",
					enableGestures: !1,
					scheme: this.getScheme(),
					port: this.getPort(),
					background: !1,
					optimizeHMD: !1,
					requestProtocolVersion: o.defaultProtocolVersion
				}), this.host = this.opts.host, this.port = this.opts.port, this.scheme = this.opts.scheme, this.protocolVersionVerified = !1, this.background = null, this.optimizeHMD = null, this.on("ready", function()
				{
					this.enableGestures(this.opts.enableGestures), this.setBackground(this.opts.background), this.setOptimizeHMD(this.opts.optimizeHMD), console.log(this.opts.optimizeHMD ? "Optimized for head mounted display usage." : "Optimized for desktop usage.")
				})
			};
		o.defaultProtocolVersion = 6, o.prototype.getUrl = function()
		{
			return this.scheme + "//" + this.host + ":" + this.port + "/v" + this.opts.requestProtocolVersion + ".json"
		}, o.prototype.getScheme = function()
		{
			return "ws:"
		}, o.prototype.getPort = function()
		{
			return 6437
		}, o.prototype.setBackground = function(t)
		{
			this.opts.background = t, this.protocol && this.protocol.sendBackground && this.background !== this.opts.background && (this.background = this.opts.background, this.protocol.sendBackground(this, this.opts.background))
		}, o.prototype.setOptimizeHMD = function(t)
		{
			this.opts.optimizeHMD = t, this.protocol && this.protocol.sendOptimizeHMD && this.optimizeHMD !== this.opts.optimizeHMD && (this.optimizeHMD = this.opts.optimizeHMD, this.protocol.sendOptimizeHMD(this, this.opts.optimizeHMD))
		}, o.prototype.handleOpen = function()
		{
			this.connected || (this.connected = !0, this.emit("connect"))
		}, o.prototype.enableGestures = function(t)
		{
			this.gesturesEnabled = t ? !0 : !1, this.send(this.protocol.encode(
			{
				enableGestures: this.gesturesEnabled
			}))
		}, o.prototype.handleClose = function(t)
		{
			this.connected && (this.disconnect(), 1001 === t && this.opts.requestProtocolVersion > 1 && (this.protocolVersionVerified ? this.protocolVersionVerified = !1 : this.opts.requestProtocolVersion--), this.startReconnection())
		}, o.prototype.startReconnection = function()
		{
			var t = this;
			this.reconnectionTimer || (this.reconnectionTimer = setInterval(function()
			{
				t.reconnect()
			}, 500))
		}, o.prototype.stopReconnection = function()
		{
			this.reconnectionTimer = clearInterval(this.reconnectionTimer)
		}, o.prototype.disconnect = function(t)
		{
			return t || this.stopReconnection(), this.socket ? (this.socket.close(), delete this.socket, delete this.protocol, delete this.background, delete this.optimizeHMD, delete this.focusedState, this.connected && (this.connected = !1, this.emit("disconnect")), !0) : void 0
		}, o.prototype.reconnect = function()
		{
			this.connected ? this.stopReconnection() : (this.disconnect(!0), this.connect())
		}, o.prototype.handleData = function(t)
		{
			var e, i = JSON.parse(t);
			void 0 === this.protocol ? (e = this.protocol = n(i), this.protocolVersionVerified = !0, this.emit("ready")) : e = this.protocol(i), this.emit(e.type, e)
		}, o.prototype.connect = function()
		{
			return this.socket ? void 0 : (this.socket = this.setupSocket(), !0)
		}, o.prototype.send = function(t)
		{
			this.socket.send(t)
		}, o.prototype.reportFocus = function(t)
		{
			this.connected && this.focusedState !== t && (this.focusedState = t, this.emit(this.focusedState ? "focus" : "blur"), this.protocol && this.protocol.sendFocused && this.protocol.sendFocused(this, this.focusedState))
		}, r.extend(o.prototype, i.prototype)
	},
	{
		"../protocol": 15,
		events: 21,
		underscore: 24
	}],
	4: [function(t, e)
	{
		var n = e.exports = t("./base"),
			i = t("underscore"),
			r = e.exports = function(t)
			{
				n.call(this, t);
				var e = this;
				this.on("ready", function()
				{
					e.startFocusLoop()
				}), this.on("disconnect", function()
				{
					e.stopFocusLoop()
				})
			};
		i.extend(r.prototype, n.prototype), r.__proto__ = n, r.prototype.useSecure = function()
		{
			return "https:" === location.protocol
		}, r.prototype.getScheme = function()
		{
			return this.useSecure() ? "wss:" : "ws:"
		}, r.prototype.getPort = function()
		{
			return this.useSecure() ? 6436 : 6437
		}, r.prototype.setupSocket = function()
		{
			var t = this,
				e = new WebSocket(this.getUrl());
			return e.onopen = function()
			{
				t.handleOpen()
			}, e.onclose = function(e)
			{
				t.handleClose(e.code, e.reason)
			}, e.onmessage = function(e)
			{
				t.handleData(e.data)
			}, e.onerror = function()
			{
				t.useSecure() && "wss:" === t.scheme && (t.scheme = "ws:", t.port = 6437, t.disconnect(), t.connect())
			}, e
		}, r.prototype.startFocusLoop = function()
		{
			if (!this.focusDetectorTimer)
			{
				var t = this,
					e = null;
				e = "undefined" != typeof document.hidden ? "hidden" : "undefined" != typeof document.mozHidden ? "mozHidden" : "undefined" != typeof document.msHidden ? "msHidden" : "undefined" != typeof document.webkitHidden ? "webkitHidden" : void 0, void 0 === t.windowVisible && (t.windowVisible = void 0 === e ? !0 : document[e] === !1);
				var n = window.addEventListener("focus", function()
					{
						t.windowVisible = !0, r()
					}),
					i = window.addEventListener("blur", function()
					{
						t.windowVisible = !1, r()
					});
				this.on("disconnect", function()
				{
					window.removeEventListener("focus", n), window.removeEventListener("blur", i)
				});
				var r = function()
				{
					var n = void 0 === e ? !0 : document[e] === !1;
					t.reportFocus(n && t.windowVisible)
				};
				r(), this.focusDetectorTimer = setInterval(r, 100)
			}
		}, r.prototype.stopFocusLoop = function()
		{
			this.focusDetectorTimer && (clearTimeout(this.focusDetectorTimer), delete this.focusDetectorTimer)
		}
	},
	{
		"./base": 3,
		underscore: 24
	}],
	5: [function(t, e)
	{
		var n = t("__browserify_process"),
			i = t("./frame"),
			r = t("./hand"),
			o = t("./pointable"),
			s = t("./finger"),
			a = t("./circular_buffer"),
			u = t("./pipeline"),
			c = t("events").EventEmitter,
			l = t("./gesture").gestureListener,
			h = t("./dialog"),
			p = t("underscore"),
			f = e.exports = function(e)
			{
				var r = "undefined" != typeof n && n.versions && n.versions.node,
					o = this;
				e = p.defaults(e ||
				{},
				{
					inNode: r
				}), this.inNode = e.inNode, e = p.defaults(e ||
				{},
				{
					frameEventName: this.useAnimationLoop() ? "animationFrame" : "deviceFrame",
					suppressAnimationLoop: !this.useAnimationLoop(),
					loopWhileDisconnected: !0,
					useAllPlugins: !1,
					checkVersion: !0
				}), this.animationFrameRequested = !1, this.onAnimationFrame = function(t)
				{
					o.lastConnectionFrame.valid && o.emit("animationFrame", o.lastConnectionFrame), o.emit("frameEnd", t), o.loopWhileDisconnected && (o.connection.focusedState !== !1 || o.connection.opts.background) ? window.requestAnimationFrame(o.onAnimationFrame) : o.animationFrameRequested = !1
				}, this.suppressAnimationLoop = e.suppressAnimationLoop, this.loopWhileDisconnected = e.loopWhileDisconnected, this.frameEventName = e.frameEventName, this.useAllPlugins = e.useAllPlugins, this.history = new a(200), this.lastFrame = i.Invalid, this.lastValidFrame = i.Invalid, this.lastConnectionFrame = i.Invalid, this.accumulatedGestures = [], this.checkVersion = e.checkVersion, this.connectionType = void 0 === e.connectionType ? t(this.inBrowser() ? "./connection/browser" : "./connection/node") : e.connectionType, this.connection = new this.connectionType(e), this.streamingCount = 0, this.devices = {}, this.plugins = {}, this._pluginPipelineSteps = {}, this._pluginExtendedMethods = {}, e.useAllPlugins && this.useRegisteredPlugins(), this.setupFrameEvents(e), this.setupConnectionEvents(), this.startAnimationLoop()
			};
		f.prototype.gesture = function(t, e)
		{
			var n = l(this, t);
			return void 0 !== e && n.stop(e), n
		}, f.prototype.setBackground = function(t)
		{
			return this.connection.setBackground(t), this
		}, f.prototype.setOptimizeHMD = function(t)
		{
			return this.connection.setOptimizeHMD(t), this
		}, f.prototype.inBrowser = function()
		{
			return !this.inNode
		}, f.prototype.useAnimationLoop = function()
		{
			return this.inBrowser() && !this.inBackgroundPage()
		}, f.prototype.inBackgroundPage = function()
		{
			return "undefined" != typeof chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window
		}, f.prototype.connect = function()
		{
			return this.connection.connect(), this
		}, f.prototype.streaming = function()
		{
			return this.streamingCount > 0
		}, f.prototype.connected = function()
		{
			return !!this.connection.connected
		}, f.prototype.startAnimationLoop = function()
		{
			this.suppressAnimationLoop || this.animationFrameRequested || (this.animationFrameRequested = !0, window.requestAnimationFrame(this.onAnimationFrame))
		}, f.prototype.disconnect = function()
		{
			return this.connection.disconnect(), this
		}, f.prototype.frame = function(t)
		{
			return this.history.get(t) || i.Invalid
		}, f.prototype.loop = function(t)
		{
			return t && ("function" == typeof t ? this.on(this.frameEventName, t) : this.setupFrameEvents(t)), this.connect()
		}, f.prototype.addStep = function(t)
		{
			this.pipeline || (this.pipeline = new u(this)), this.pipeline.addStep(t)
		}, f.prototype.processFrame = function(t)
		{
			t.gestures && (this.accumulatedGestures = this.accumulatedGestures.concat(t.gestures)), this.lastConnectionFrame = t, this.startAnimationLoop(), this.emit("deviceFrame", t)
		}, f.prototype.processFinishedFrame = function(t)
		{
			if (this.lastFrame = t, t.valid && (this.lastValidFrame = t), t.controller = this, t.historyIdx = this.history.push(t), t.gestures)
			{
				t.gestures = this.accumulatedGestures, this.accumulatedGestures = [];
				for (var e = 0; e != t.gestures.length; e++) this.emit("gesture", t.gestures[e], t)
			}
			this.pipeline && (t = this.pipeline.run(t), t || (t = i.Invalid)), this.emit("frame", t), this.emitHandEvents(t)
		}, f.prototype.emitHandEvents = function(t)
		{
			for (var e = 0; e < t.hands.length; e++) this.emit("hand", t.hands[e])
		}, f.prototype.setupFrameEvents = function(t)
		{
			t.frame && this.on("frame", t.frame), t.hand && this.on("hand", t.hand)
		}, f.prototype.setupConnectionEvents = function()
		{
			var t = this;
			this.connection.on("frame", function(e)
			{
				t.processFrame(e)
			}), this.on(this.frameEventName, function(e)
			{
				t.processFinishedFrame(e)
			});
			var e = function()
				{
					if (t.connection.opts.requestProtocolVersion < 5 && 0 == t.streamingCount)
					{
						t.streamingCount = 1;
						var n = {
							attached: !0,
							streaming: !0,
							type: "unknown",
							id: "Lx00000000000"
						};
						t.devices[n.id] = n, t.emit("deviceAttached", n), t.emit("deviceStreaming", n), t.emit("streamingStarted", n), t.connection.removeListener("frame", e)
					}
				},
				n = function()
				{
					if (t.streamingCount > 0)
					{
						for (var e in t.devices) t.emit("deviceStopped", t.devices[e]), t.emit("deviceRemoved", t.devices[e]);
						t.emit("streamingStopped", t.devices[e]), t.streamingCount = 0;
						for (var e in t.devices) delete t.devices[e]
					}
				};
			this.connection.on("focus", function()
			{
				t.loopWhileDisconnected && t.startAnimationLoop(), t.emit("focus")
			}), this.connection.on("blur", function()
			{
				t.emit("blur")
			}), this.connection.on("protocol", function(e)
			{
				e.on("beforeFrameCreated", function(e)
				{
					t.emit("beforeFrameCreated", e)
				}), e.on("afterFrameCreated", function(e, n)
				{
					t.emit("afterFrameCreated", e, n)
				}), t.emit("protocol", e)
			}), this.connection.on("ready", function()
			{
				t.checkVersion && !t.inNode && t.checkOutOfDate(), t.emit("ready")
			}), this.connection.on("connect", function()
			{
				t.emit("connect"), t.connection.removeListener("frame", e), t.connection.on("frame", e)
			}), this.connection.on("disconnect", function()
			{
				t.emit("disconnect"), n()
			}), this.connection.on("deviceConnect", function(i)
			{
				i.state ? (t.emit("deviceConnected"), t.connection.removeListener("frame", e), t.connection.on("frame", e)) : (t.emit("deviceDisconnected"), n())
			}), this.connection.on("deviceEvent", function(e)
			{
				var n = e.state,
					i = t.devices[n.id],
					r = {};
				for (var o in n) i && i.hasOwnProperty(o) && i[o] == n[o] || (r[o] = !0);
				t.devices[n.id] = n, r.attached && t.emit(n.attached ? "deviceAttached" : "deviceRemoved", n), r.streaming && (n.streaming ? (t.streamingCount++, t.emit("deviceStreaming", n), 1 == t.streamingCount && t.emit("streamingStarted", n), r.attached || t.emit("deviceConnected")) : r.attached && n.attached || (t.streamingCount--, t.emit("deviceStopped", n), 0 == t.streamingCount && t.emit("streamingStopped", n), t.emit("deviceDisconnected")))
			}), this.on("newListener", function(t)
			{
				("deviceConnected" == t || "deviceDisconnected" == t) && console.warn(t + " events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead")
			})
		}, f.prototype.checkOutOfDate = function()
		{
			console.assert(this.connection && this.connection.protocol);
			var t = this.connection.protocol.serviceVersion,
				e = this.connection.protocol.version,
				n = this.connectionType.defaultProtocolVersion;
			return n > e ? (console.warn("Your Protocol Version is v" + e + ", this app was designed for v" + n), h.warnOutOfDate(
			{
				sV: t,
				pV: e
			}), !0) : !1
		}, f._pluginFactories = {}, f.plugin = function(t, e)
		{
			return this._pluginFactories[t] && console.warn('Plugin "' + t + '" already registered'), this._pluginFactories[t] = e
		}, f.plugins = function()
		{
			return p.keys(this._pluginFactories)
		};
		var d = function(t, e, n)
			{
				-1 != ["beforeFrameCreated", "afterFrameCreated"].indexOf(e) ? this.on(e, n) : (this.pipeline || (this.pipeline = new u(this)), this._pluginPipelineSteps[t] || (this._pluginPipelineSteps[t] = []), this._pluginPipelineSteps[t].push(this.pipeline.addWrappedStep(e, n)))
			},
			m = function(t, e, n)
			{
				var a;
				switch (this._pluginExtendedMethods[t] || (this._pluginExtendedMethods[t] = []), e)
				{
					case "frame":
						a = i;
						break;
					case "hand":
						a = r;
						break;
					case "pointable":
						a = o, p.extend(s.prototype, n), p.extend(s.Invalid, n);
						break;
					case "finger":
						a = s;
						break;
					default:
						throw t + ' specifies invalid object type "' + e + '" for prototypical extension'
				}
				p.extend(a.prototype, n), p.extend(a.Invalid, n), this._pluginExtendedMethods[t].push([a, n])
			};
		f.prototype.use = function(t, e)
		{
			var n, i, r, o;
			if (i = "function" == typeof t ? t : f._pluginFactories[t], !i) throw "Leap Plugin " + t + " not found.";
			if (e || (e = {}), this.plugins[t]) return p.extend(this.plugins[t], e), this;
			this.plugins[t] = e, o = i.call(this, e);
			for (r in o) n = o[r], "function" == typeof n ? d.call(this, t, r, n) : m.call(this, t, r, n);
			return this
		}, f.prototype.stopUsing = function(t)
		{
			var e, n, i = this._pluginPipelineSteps[t],
				r = this._pluginExtendedMethods[t],
				o = 0;
			if (this.plugins[t])
			{
				if (i)
					for (o = 0; o < i.length; o++) this.pipeline.removeStep(i[o]);
				if (r)
					for (o = 0; o < r.length; o++)
					{
						e = r[o][0], n = r[o][1];
						for (var s in n) delete e.prototype[s], delete e.Invalid[s]
					}
				return delete this.plugins[t], this
			}
		}, f.prototype.useRegisteredPlugins = function()
		{
			for (var t in f._pluginFactories) this.use(t)
		}, p.extend(f.prototype, c.prototype)
	},
	{
		"./circular_buffer": 2,
		"./connection/browser": 4,
		"./connection/node": 20,
		"./dialog": 6,
		"./finger": 7,
		"./frame": 8,
		"./gesture": 9,
		"./hand": 10,
		"./pipeline": 13,
		"./pointable": 14,
		__browserify_process: 22,
		events: 21,
		underscore: 24
	}],
	6: [function(t, e)
	{
		var n = t("__browserify_process"),
			i = e.exports = function(t, e)
			{
				this.options = e ||
				{}, this.message = t, this.createElement()
			};
		i.prototype.createElement = function()
		{
			this.element = document.createElement("div"), this.element.className = "leapjs-dialog", this.element.style.position = "fixed", this.element.style.top = "8px", this.element.style.left = 0, this.element.style.right = 0, this.element.style.textAlign = "center", this.element.style.zIndex = 1e3;
			var t = document.createElement("div");
			this.element.appendChild(t), t.
			style.className = "leapjs-dialog", t.style.display = "inline-block", t.style.margin = "auto", t.style.padding = "8px", t.style.color = "#222", t.style.background = "#eee", t.style.borderRadius = "4px", t.style.border = "1px solid #999", t.style.textAlign = "left", t.style.cursor = "pointer", t.style.whiteSpace = "nowrap", t.style.transition = "box-shadow 1s linear", t.innerHTML = this.message, this.options.onclick && t.addEventListener("click", this.options.onclick), this.options.onmouseover && t.addEventListener("mouseover", this.options.onmouseover), this.options.onmouseout && t.addEventListener("mouseout", this.options.onmouseout), this.options.onmousemove && t.addEventListener("mousemove", this.options.onmousemove)
		}, i.prototype.show = function()
		{
			return document.body.appendChild(this.element), this
		}, i.prototype.hide = function()
		{
			return document.body.removeChild(this.element), this
		}, i.warnOutOfDate = function(t)
		{
			t || (t = {});
			var e = "http://developer.leapmotion.com?";
			t.returnTo = window.location.href;
			for (var n in t) e += n + "=" + encodeURIComponent(t[n]) + "&";
			var r, o = function(t)
				{
					if ("leapjs-decline-upgrade" != t.target.id)
					{
						var n = window.open(e, "_blank", "height=800,width=1000,location=1,menubar=1,resizable=1,status=1,toolbar=1,scrollbars=1");
						window.focus && n.focus()
					}
					return r.hide(), !0
				},
				s = "This site requires Leap Motion Tracking V2.<button id='leapjs-accept-upgrade'  style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 16px;'>Upgrade</button><button id='leapjs-decline-upgrade' style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 8px; '>Not Now</button>";
			return r = new i(s,
			{
				onclick: o,
				onmousemove: function(t)
				{
					t.target == document.getElementById("leapjs-decline-upgrade") ? (document.getElementById("leapjs-decline-upgrade").style.color = "#000", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "0px 0px 2px #5daa00", document.getElementById("leapjs-accept-upgrade").style.color = "#444", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "none") : (document.getElementById("leapjs-accept-upgrade").style.color = "#000", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "0px 0px 2px #5daa00", document.getElementById("leapjs-decline-upgrade").style.color = "#444", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "none")
				},
				onmouseout: function()
				{
					document.getElementById("leapjs-decline-upgrade").style.color = "#444", document.getElementById("leapjs-decline-upgrade").style.boxShadow = "none", document.getElementById("leapjs-accept-upgrade").style.color = "#444", document.getElementById("leapjs-accept-upgrade").style.boxShadow = "none"
				}
			}), r.show()
		}, i.hasWarnedBones = !1, i.warnBones = function()
		{
			this.hasWarnedBones || (this.hasWarnedBones = !0, console.warn("Your Leap Service is out of date"), "undefined" != typeof n && n.versions && n.versions.node || this.warnOutOfDate(
			{
				reason: "bones"
			}))
		}
	},
	{
		__browserify_process: 22
	}],
	7: [function(t, e)
	{
		var n = t("./pointable"),
			i = t("./bone"),
			r = t("./dialog"),
			o = t("underscore"),
			s = e.exports = function(t)
			{
				n.call(this, t), this.dipPosition = t.dipPosition, this.pipPosition = t.pipPosition, this.mcpPosition = t.mcpPosition, this.carpPosition = t.carpPosition, this.extended = t.extended, this.type = t.type, this.finger = !0, this.positions = [this.carpPosition, this.mcpPosition, this.pipPosition, this.dipPosition, this.tipPosition], t.bases ? this.addBones(t) : r.warnBones()
			};
		o.extend(s.prototype, n.prototype), s.prototype.addBones = function(t)
		{
			this.metacarpal = new i(this,
			{
				type: 0,
				width: this.width,
				prevJoint: this.carpPosition,
				nextJoint: this.mcpPosition,
				basis: t.bases[0]
			}), this.proximal = new i(this,
			{
				type: 1,
				width: this.width,
				prevJoint: this.mcpPosition,
				nextJoint: this.pipPosition,
				basis: t.bases[1]
			}), this.medial = new i(this,
			{
				type: 2,
				width: this.width,
				prevJoint: this.pipPosition,
				nextJoint: this.dipPosition,
				basis: t.bases[2]
			}), this.distal = new i(this,
			{
				type: 3,
				width: this.width,
				prevJoint: this.dipPosition,
				nextJoint: t.btipPosition,
				basis: t.bases[3]
			}), this.bones = [this.metacarpal, this.proximal, this.medial, this.distal]
		}, s.prototype.toString = function()
		{
			return "Finger [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + " ]"
		}, s.Invalid = {
			valid: !1
		}
	},
	{
		"./bone": 1,
		"./dialog": 6,
		"./pointable": 14,
		underscore: 24
	}],
	8: [function(t, e)
	{
		var n = t("./hand"),
			i = t("./pointable"),
			r = t("./gesture").createGesture,
			o = t("gl-matrix"),
			s = o.mat3,
			a = o.vec3,
			u = t("./interaction_box"),
			c = t("./finger"),
			l = t("underscore"),
			h = e.exports = function(t)
			{
				if (this.valid = !0, this.id = t.id, this.timestamp = t.timestamp, this.hands = [], this.handsMap = {}, this.pointables = [], this.tools = [], this.fingers = [], t.interactionBox && (this.interactionBox = new u(t.interactionBox)), this.gestures = [], this.pointablesMap = {}, this._translation = t.t, this._rotation = l.flatten(t.r), this._scaleFactor = t.s, this.data = t, this.type = "frame", this.currentFrameRate = t.currentFrameRate, t.gestures)
					for (var e = 0, n = t.gestures.length; e != n; e++) this.gestures.push(r(t.gestures[e]));
				this.postprocessData(t)
			};
		h.prototype.postprocessData = function(t)
		{
			t || (t = this.data);
			for (var e = 0, r = t.hands.length; e != r; e++)
			{
				var o = new n(t.hands[e]);
				o.frame = this, this.hands.push(o), this.handsMap[o.id] = o
			}
			t.pointables = l.sortBy(t.pointables, function(t)
			{
				return t.id
			});
			for (var s = 0, a = t.pointables.length; s != a; s++)
			{
				var u = t.pointables[s],
					h = u.dipPosition ? new c(u) : new i(u);
				h.frame = this, this.addPointable(h)
			}
		}, h.prototype.addPointable = function(t)
		{
			if (this.pointables.push(t), this.pointablesMap[t.id] = t, (t.tool ? this.tools : this.fingers).push(t), void 0 !== t.handId && this.handsMap.hasOwnProperty(t.handId))
			{
				var e = this.handsMap[t.handId];
				switch (e.pointables.push(t), (t.tool ? e.tools : e.fingers).push(t), t.type)
				{
					case 0:
						e.thumb = t;
						break;
					case 1:
						e.indexFinger = t;
						break;
					case 2:
						e.middleFinger = t;
						break;
					case 3:
						e.ringFinger = t;
						break;
					case 4:
						e.pinky = t
				}
			}
		}, h.prototype.tool = function(t)
		{
			var e = this.pointable(t);
			return e.tool ? e : i.Invalid
		}, h.prototype.pointable = function(t)
		{
			return this.pointablesMap[t] || i.Invalid
		}, h.prototype.finger = function(t)
		{
			var e = this.pointable(t);
			return e.tool ? i.Invalid : e
		}, h.prototype.hand = function(t)
		{
			return this.handsMap[t] || n.Invalid
		}, h.prototype.rotationAngle = function(t, e)
		{
			if (!this.valid || !t.valid) return 0;
			var n = this.rotationMatrix(t),
				i = .5 * (n[0] + n[4] + n[8] - 1),
				r = Math.acos(i);
			if (r = isNaN(r) ? 0 : r, void 0 !== e)
			{
				var o = this.rotationAxis(t);
				r *= a.dot(o, a.normalize(a.create(), e))
			}
			return r
		}, h.prototype.rotationAxis = function(t)
		{
			return this.valid && t.valid ? a.normalize(a.create(), [this._rotation[7] - t._rotation[5], this._rotation[2] - t._rotation[6], this._rotation[3] - t._rotation[1]]) : a.create()
		}, h.prototype.rotationMatrix = function(t)
		{
			if (!this.valid || !t.valid) return s.create();
			var e = s.transpose(s.create(), this._rotation);
			return s.multiply(s.create(), t._rotation, e)
		}, h.prototype.scaleFactor = function(t)
		{
			return this.valid && t.valid ? Math.exp(this._scaleFactor - t._scaleFactor) : 1
		}, h.prototype.translation = function(t)
		{
			return this.valid && t.valid ? a.subtract(a.create(), this._translation, t._translation) : a.create()
		}, h.prototype.toString = function()
		{
			var t = "Frame [ id:" + this.id + " | timestamp:" + this.timestamp + " | Hand count:(" + this.hands.length + ") | Pointable count:(" + this.pointables.length + ")";
			return this.gestures && (t += " | Gesture count:(" + this.gestures.length + ")"), t += " ]"
		}, h.prototype.dump = function()
		{
			var t = "";
			t += "Frame Info:<br/>", t += this.toString(), t += "<br/><br/>Hands:<br/>";
			for (var e = 0, n = this.hands.length; e != n; e++) t += "  " + this.hands[e].toString() + "<br/>";
			t += "<br/><br/>Pointables:<br/>";
			for (var i = 0, r = this.pointables.length; i != r; i++) t += "  " + this.pointables[i].toString() + "<br/>";
			if (this.gestures)
			{
				t += "<br/><br/>Gestures:<br/>";
				for (var o = 0, s = this.gestures.length; o != s; o++) t += "  " + this.gestures[o].toString() + "<br/>"
			}
			return t += "<br/><br/>Raw JSON:<br/>", t += JSON.stringify(this.data)
		}, h.Invalid = {
			valid: !1,
			hands: [],
			fingers: [],
			tools: [],
			gestures: [],
			pointables: [],
			pointable: function()
			{
				return i.Invalid
			},
			finger: function()
			{
				return i.Invalid
			},
			hand: function()
			{
				return n.Invalid
			},
			toString: function()
			{
				return "invalid frame"
			},
			dump: function()
			{
				return this.toString()
			},
			rotationAngle: function()
			{
				return 0
			},
			rotationMatrix: function()
			{
				return s.create()
			},
			rotationAxis: function()
			{
				return a.create()
			},
			scaleFactor: function()
			{
				return 1
			},
			translation: function()
			{
				return a.create()
			}
		}
	},
	{
		"./finger": 7,
		"./gesture": 9,
		"./hand": 10,
		"./interaction_box": 12,
		"./pointable": 14,
		"gl-matrix": 23,
		underscore: 24
	}],
	9: [function(t, e, n)
	{
		var i = t("gl-matrix"),
			r = i.vec3,
			o = t("events").EventEmitter,
			s = t("underscore"),
			a = (n.createGesture = function(t)
			{
				var e;
				switch (t.type)
				{
					case "circle":
						e = new u(t);
						break;
					case "swipe":
						e = new c(t);
						break;
					case "screenTap":
						e = new l(t);
						break;
					case "keyTap":
						e = new h(t);
						break;
					default:
						throw "unknown gesture type"
				}
				return e.id = t.id, e.handIds = t.handIds.slice(), e.pointableIds = t.pointableIds.slice(), e.duration = t.duration, e.state = t.state, e.type = t.type, e
			}, n.gestureListener = function(t, e)
			{
				var n = {},
					i = {};
				t.on("gesture", function(t, r)
				{
					if (t.type == e)
					{
						if (("start" == t.state || "stop" == t.state) && void 0 === i[t.id])
						{
							var o = new a(t, r);
							i[t.id] = o, s.each(n, function(t, e)
							{
								o.on(e, t)
							})
						}
						i[t.id].update(t, r), "stop" == t.state && delete i[t.id]
					}
				});
				var r = {
					start: function(t)
					{
						return n.start = t, r
					},
					stop: function(t)
					{
						return n.stop = t, r
					},
					complete: function(t)
					{
						return n.stop = t, r
					},
					update: function(t)
					{
						return n.update = t, r
					}
				};
				return r
			}, n.Gesture = function(t, e)
			{
				this.gestures = [t], this.frames = [e]
			});
		a.prototype.update = function(t, e)
		{
			this.lastGesture = t, this.lastFrame = e, this.gestures.push(t), this.frames.push(e), this.emit(t.state, this)
		}, a.prototype.translation = function()
		{
			return r.subtract(r.create(), this.lastGesture.startPosition, this.lastGesture.position)
		}, s.extend(a.prototype, o.prototype);
		var u = function(t)
		{
			this.center = t.center, this.normal = t.normal, this.progress = t.progress, this.radius = t.radius
		};
		u.prototype.toString = function()
		{
			return "CircleGesture [" + JSON.stringify(this) + "]"
		};
		var c = function(t)
		{
			this.startPosition = t.startPosition, this.position = t.position, this.direction = t.direction, this.speed = t.speed
		};
		c.prototype.toString = function()
		{
			return "SwipeGesture [" + JSON.stringify(this) + "]"
		};
		var l = function(t)
		{
			this.position = t.position, this.direction = t.direction, this.progress = t.progress
		};
		l.prototype.toString = function()
		{
			return "ScreenTapGesture [" + JSON.stringify(this) + "]"
		};
		var h = function(t)
		{
			this.position = t.position, this.direction = t.direction, this.progress = t.progress
		};
		h.prototype.toString = function()
		{
			return "KeyTapGesture [" + JSON.stringify(this) + "]"
		}
	},
	{
		events: 21,
		"gl-matrix": 23,
		underscore: 24
	}],
	10: [function(t, e)
	{
		var n = t("./pointable"),
			i = t("./bone"),
			r = t("gl-matrix"),
			o = r.mat3,
			s = r.vec3,
			a = t("underscore"),
			u = e.exports = function(t)
			{
				this.id = t.id, this.palmPosition = t.palmPosition, this.direction = t.direction, this.palmVelocity = t.palmVelocity, this.palmNormal = t.palmNormal, this.sphereCenter = t.sphereCenter, this.sphereRadius = t.sphereRadius, this.valid = !0, this.pointables = [], this.fingers = [], this.arm = t.armBasis ? new i(this,
				{
					type: 4,
					width: t.armWidth,
					prevJoint: t.elbow,
					nextJoint: t.wrist,
					basis: t.armBasis
				}) : null, this.tools = [], this._translation = t.t, this._rotation = a.flatten(t.r), this._scaleFactor = t.s, this.timeVisible = t.timeVisible, this.stabilizedPalmPosition = t.stabilizedPalmPosition, this.type = t.type, this.grabStrength = t.grabStrength, this.pinchStrength = t.pinchStrength, this.confidence = t.confidence
			};
		u.prototype.finger = function(t)
		{
			var e = this.frame.finger(t);
			return e && e.handId == this.id ? e : n.Invalid
		}, u.prototype.rotationAngle = function(t, e)
		{
			if (!this.valid || !t.valid) return 0;
			var n = t.hand(this.id);
			if (!n.valid) return 0;
			var i = this.rotationMatrix(t),
				r = .5 * (i[0] + i[4] + i[8] - 1),
				o = Math.acos(r);
			if (o = isNaN(o) ? 0 : o, void 0 !== e)
			{
				var a = this.rotationAxis(t);
				o *= s.dot(a, s.normalize(s.create(), e))
			}
			return o
		}, u.prototype.rotationAxis = function(t)
		{
			if (!this.valid || !t.valid) return s.create();
			var e = t.hand(this.id);
			return e.valid ? s.normalize(s.create(), [this._rotation[7] - e._rotation[5], this._rotation[2] - e._rotation[6], this._rotation[3] - e._rotation[1]]) : s.create()
		}, u.prototype.rotationMatrix = function(t)
		{
			if (!this.valid || !t.valid) return o.create();
			var e = t.hand(this.id);
			if (!e.valid) return o.create();
			var n = o.transpose(o.create(), this._rotation),
				i = o.multiply(o.create(), e._rotation, n);
			return i
		}, u.prototype.scaleFactor = function(t)
		{
			if (!this.valid || !t.valid) return 1;
			var e = t.hand(this.id);
			return e.valid ? Math.exp(this._scaleFactor - e._scaleFactor) : 1
		}, u.prototype.translation = function(t)
		{
			if (!this.valid || !t.valid) return s.create();
			var e = t.hand(this.id);
			return e.valid ? [this._translation[0] - e._translation[0], this._translation[1] - e._translation[1], this._translation[2] - e._translation[2]] : s.create()
		}, u.prototype.toString = function()
		{
			return "Hand (" + this.type + ") [ id: " + this.id + " | palm velocity:" + this.palmVelocity + " | sphere center:" + this.sphereCenter + " ] "
		}, u.prototype.pitch = function()
		{
			return Math.atan2(this.direction[1], -this.direction[2])
		}, u.prototype.yaw = function()
		{
			return Math.atan2(this.direction[0], -this.direction[2])
		}, u.prototype.roll = function()
		{
			return Math.atan2(this.palmNormal[0], -this.palmNormal[1])
		}, u.Invalid = {
			valid: !1,
			fingers: [],
			tools: [],
			pointables: [],
			left: !1,
			pointable: function()
			{
				return n.Invalid
			},
			finger: function()
			{
				return n.Invalid
			},
			toString: function()
			{
				return "invalid frame"
			},
			dump: function()
			{
				return this.toString()
			},
			rotationAngle: function()
			{
				return 0
			},
			rotationMatrix: function()
			{
				return o.create()
			},
			rotationAxis: function()
			{
				return s.create()
			},
			scaleFactor: function()
			{
				return 1
			},
			translation: function()
			{
				return s.create()
			}
		}
	},
	{
		"./bone": 1,
		"./pointable": 14,
		"gl-matrix": 23,
		underscore: 24
	}],
	11: [function(t, e)
	{
		e.exports = {
			Controller: t("./controller"),
			Frame: t("./frame"),
			Gesture: t("./gesture"),
			Hand: t("./hand"),
			Pointable: t("./pointable"),
			Finger: t("./finger"),
			InteractionBox: t("./interaction_box"),
			CircularBuffer: t("./circular_buffer"),
			UI: t("./ui"),
			JSONProtocol: t("./protocol").JSONProtocol,
			glMatrix: t("gl-matrix"),
			mat3: t("gl-matrix").mat3,
			vec3: t("gl-matrix").vec3,
			loopController: void 0,
			version: t("./version.js"),
			_: t("underscore"),
			EventEmitter: t("events").EventEmitter,
			loop: function(t, e)
			{
				return t && void 0 === e && "[object Function]" ===
				{}.toString.call(t) && (e = t, t = {}), this.loopController ? t && this.loopController.setupFrameEvents(t) : this.loopController = new this.Controller(t), this.loopController.loop(e), this.loopController
			},
			plugin: function(t, e)
			{
				this.Controller.plugin(t, e)
			}
		}
	},
	{
		"./circular_buffer": 2,
		"./controller": 5,
		"./finger": 7,
		"./frame": 8,
		"./gesture": 9,
		"./hand": 10,
		"./interaction_box": 12,
		"./pointable": 14,
		"./protocol": 15,
		"./ui": 16,
		"./version.js": 19,
		events: 21,
		"gl-matrix": 23,
		underscore: 24
	}],
	12: [function(t, e)
	{
		var n = t("gl-matrix"),
			i = n.vec3,
			r = e.exports = function(t)
			{
				this.valid = !0, this.center = t.center, this.size = t.size, this.width = t.size[0], this.height = t.size[1], this.depth = t.size[2]
			};
		r.prototype.denormalizePoint = function(t)
		{
			return i.fromValues((t[0] - .5) * this.size[0] + this.center[0], (t[1] - .5) * this.size[1] + this.center[1], (t[2] - .5) * this.size[2] + this.center[2])
		}, r.prototype.normalizePoint = function(t, e)
		{
			var n = i.fromValues((t[0] - this.center[0]) / this.size[0] + .5, (t[1] - this.center[1]) / this.size[1] + .5, (t[2] - this.center[2]) / this.size[2] + .5);
			return e && (n[0] = Math.min(Math.max(n[0], 0), 1), n[1] = Math.min(Math.max(n[1], 0), 1), n[2] = Math.min(Math.max(n[2], 0), 1)), n
		}, r.prototype.toString = function()
		{
			return "InteractionBox [ width:" + this.width + " | height:" + this.height + " | depth:" + this.depth + " ]"
		}, r.Invalid = {
			valid: !1
		}
	},
	{
		"gl-matrix": 23
	}],
	13: [function(t, e)
	{
		var n = e.exports = function(t)
		{
			this.steps = [], this.controller = t
		};
		n.prototype.addStep = function(t)
		{
			this.steps.push(t)
		}, n.prototype.run = function(t)
		{
			for (var e = this.steps.length, n = 0; n != e && t; n++) t = this.steps[n](t);
			return t
		}, n.prototype.removeStep = function(t)
		{
			var e = this.steps.indexOf(t);
			if (-1 === e) throw "Step not found in pipeline";
			this.steps.splice(e, 1)
		}, n.prototype.addWrappedStep = function(t, e)
		{
			var n = this.controller,
				i = function(i)
				{
					var r, o, s;
					for (r = "frame" == t ? [i] : i[t + "s"] || [], o = 0, s = r.length; s > o; o++) e.call(n, r[o]);
					return i
				};
			return this.addStep(i), i
		}
	},
	{}],
	14: [function(t, e)
	{
		var n = t("gl-matrix"),
			i = (n.vec3, e.exports = function(t)
			{
				this.valid = !0, this.id = t.id, this.handId = t.handId, this.length = t.length, this.tool = t.tool, this.width = t.width, this.direction = t.direction, this.stabilizedTipPosition = t.stabilizedTipPosition, this.tipPosition = t.tipPosition, this.tipVelocity = t.tipVelocity, this.touchZone = t.touchZone, this.touchDistance = t.touchDistance, this.timeVisible = t.timeVisible
			});
		i.prototype.toString = function()
		{
			return "Pointable [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + " ]"
		}, i.prototype.hand = function()
		{
			return this.frame.hand(this.handId)
		}, i.Invalid = {
			valid: !1
		}
	},
	{
		"gl-matrix": 23
	}],
	15: [function(t, e, n)
	{
		var i = t("./frame"),
			r = (t("./hand"), t("./pointable"), t("./finger"), t("underscore")),
			o = t("events").EventEmitter,
			s = function(t)
			{
				this.type = t.type, this.state = t.state
			};
		n.chooseProtocol = function(t)
		{
			var e;
			switch (t.version)
			{
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					e = a(t), e.sendBackground = function(t, n)
					{
						t.send(e.encode(
						{
							background: n
						}))
					}, e.sendFocused = function(t, n)
					{
						t.send(e.encode(
						{
							focused: n
						}))
					}, e.sendOptimizeHMD = function(t, n)
					{
						t.send(e.encode(
						{
							optimizeHMD: n
						}))
					};
					break;
				default:
					throw "unrecognized version"
			}
			return e
		};
		var a = n.JSONProtocol = function(t)
		{
			var e = function(t)
			{
				if (t.event) return new s(t.event);
				e.emit("beforeFrameCreated", t);
				var n = new i(t);
				return e.emit("afterFrameCreated", n, t), n
			};
			return e.encode = function(t)
			{
				return JSON.stringify(t)
			}, e.version = t.version, e.serviceVersion = t.serviceVersion, e.versionLong = "Version " + t.version, e.type = "protocol", r.extend(e, o.prototype), e
		}
	},
	{
		"./finger": 7,
		"./frame": 8,
		"./hand": 10,
		"./pointable": 14,
		events: 21,
		underscore: 24
	}],
	16: [function(t, e, n)
	{
		n.UI = {
			Region: t("./ui/region"),
			Cursor: t("./ui/cursor")
		}
	},
	{
		"./ui/cursor": 17,
		"./ui/region": 18
	}],
	17: [function(t, e)
	{
		e.exports = function()
		{
			return function(t)
			{
				var e = t.pointables.sort(function(t, e)
				{
					return t.z - e.z
				})[0];
				return e && e.valid && (t.cursorPosition = e.tipPosition), t
			}
		}
	},
	{}],
	18: [function(t, e)
	{
		var n = t("events").EventEmitter,
			i = t("underscore"),
			r = e.exports = function(t, e)
			{
				this.start = new Vector(t), this.end = new Vector(e), this.enteredFrame = null
			};
		r.prototype.hasPointables = function(t)
		{
			for (var e = 0; e != t.pointables.length; e++)
			{
				var n = t.pointables[e].tipPosition;
				if (n.x >= this.start.x && n.x <= this.end.x && n.y >= this.start.y && n.y <= this.end.y && n.z >= this.start.z && n.z <= this.end.z) return !0
			}
			return !1
		}, r.prototype.listener = function(t)
		{
			var e = this;
			return t && t.nearThreshold && this.setupNearRegion(t.nearThreshold),
				function(t)
				{
					return e.updatePosition(t)
				}
		}, r.prototype.clipper = function()
		{
			var t = this;
			return function(e)
			{
				return t.updatePosition(e), t.enteredFrame ? e : null
			}
		}, r.prototype.setupNearRegion = function(t)
		{
			var e = this.nearRegion = new r([this.start.x - t, this.start.y - t, this.start.z - t], [this.end.x + t, this.end.y + t, this.end.z + t]),
				n = this;
			e.on("enter", function(t)
			{
				n.emit("near", t)
			}), e.on("exit", function(t)
			{
				n.emit("far", t)
			}), n.on("exit", function(t)
			{
				n.emit("near", t)
			})
		}, r.prototype.updatePosition = function(t)
		{
			return this.nearRegion && this.nearRegion.updatePosition(t), this.hasPointables(t) && null == this.enteredFrame ? (this.enteredFrame = t, this.emit("enter", this.enteredFrame)) : this.hasPointables(t) || null == this.enteredFrame || (this.enteredFrame = null, this.emit("exit", this.enteredFrame)), t
		}, r.prototype.normalize = function(t)
		{
			return new Vector([(t.x - this.start.x) / (this.end.x - this.start.x), (t.y - this.start.y) / (this.end.y - this.start.y), (t.z - this.start.z) / (this.end.z - this.start.z)])
		}, r.prototype.mapToXY = function(t, e, n)
		{
			var i = this.normalize(t),
				r = i.x,
				o = i.y;
			return r > 1 ? r = 1 : -1 > r && (r = -1), o > 1 ? o = 1 : -1 > o && (o = -1), [(r + 1) / 2 * e, (1 - o) / 2 * n, i.z]
		}, i.extend(r.prototype, n.prototype)
	},
	{
		events: 21,
		underscore: 24
	}],
	19: [function(t, e)
	{
		e.exports = {
			full: "0.6.4",
			major: 0,
			minor: 6,
			dot: 4
		}
	},
	{}],
	20: [function() {},
	{}],
	21: [function(t, e, n)
	{
		function i(t, e)
		{
			if (t.indexOf) return t.indexOf(e);
			for (var n = 0; n < t.length; n++)
				if (e === t[n]) return n;
			return -1
		}
		var r = t("__browserify_process");
		r.EventEmitter || (r.EventEmitter = function() {});
		var o = n.EventEmitter = r.EventEmitter,
			s = "function" == typeof Array.isArray ? Array.isArray : function(t)
			{
				return "[object Array]" === Object.prototype.toString.call(t)
			},
			a = 10;
		o.prototype.setMaxListeners = function(t)
		{
			this._events || (this._events = {}), this._events.maxListeners = t
		}, o.prototype.emit = function(t)
		{
			if ("error" === t && (!this._events || !this._events.error || s(this._events.error) && !this._events.error.length)) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
			if (!this._events) return !1;
			var e = this._events[t];
			if (!e) return !1;
			if ("function" == typeof e)
			{
				switch (arguments.length)
				{
					case 1:
						e.call(this);
						break;
					case 2:
						e.call(this, arguments[1]);
						break;
					case 3:
						e.call(this, arguments[1], arguments[2]);
						break;
					default:
						var n = Array.prototype.slice.call(arguments, 1);
						e.apply(this, n)
				}
				return !0
			}
			if (s(e))
			{
				for (var n = Array.prototype.slice.call(arguments, 1), i = e.slice(), r = 0, o = i.length; o > r; r++) i[r].apply(this, n);
				return !0
			}
			return !1
		}, o.prototype.addListener = function(t, e)
		{
			if ("function" != typeof e) throw new Error("addListener only takes instances of Function");
			if (this._events || (this._events = {}), this.emit("newListener", t, e), this._events[t])
				if (s(this._events[t]))
				{
					if (!this._events[t].warned)
					{
						var n;
						n = void 0 !== this._events.maxListeners ? this._events.maxListeners : a, n && n > 0 && this._events[t].length > n && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), console.trace())
					}
					this._events[t].push(e)
				}
				else this._events[t] = [this._events[t], e];
			else this._events[t] = e;
			return this
		}, o.prototype.on = o.prototype.addListener, o.prototype.once = function(t, e)
		{
			var n = this;
			return n.on(t, function i()
			{
				n.removeListener(t, i), e.apply(this, arguments)
			}), this
		}, o.prototype.removeListener = function(t, e)
		{
			if ("function" != typeof e) throw new Error("removeListener only takes instances of Function");
			if (!this._events || !this._events[t]) return this;
			var n = this._events[t];
			if (s(n))
			{
				var r = i(n, e);
				if (0 > r) return this;
				n.splice(r, 1), 0 == n.length && delete this._events[t]
			}
			else this._events[t] === e && delete this._events[t];
			return this
		}, o.prototype.removeAllListeners = function(t)
		{
			return 0 === arguments.length ? (this._events = {}, this) : (t && this._events && this._events[t] && (this._events[t] = null), this)
		}, o.prototype.listeners = function(t)
		{
			return this._events || (this._events = {}), this._events[t] || (this._events[t] = []), s(this._events[t]) || (this._events[t] = [this._events[t]]), this._events[t]
		}, o.listenerCount = function(t, e)
		{
			var n;
			return n = t._events && t._events[e] ? "function" == typeof t._events[e] ? 1 : t._events[e].length : 0
		}
	},
	{
		__browserify_process: 22
	}],
	22: [function(t, e)
	{
		var n = e.exports = {};
		n.nextTick = function()
		{
			var t = "undefined" != typeof window && window.setImmediate,
				e = "undefined" != typeof window && window.postMessage && window.addEventListener;
			if (t) return function(t)
			{
				return window.setImmediate(t)
			};
			if (e)
			{
				var n = [];
				return window.addEventListener("message", function(t)
					{
						var e = t.source;
						if ((e === window || null === e) && "process-tick" === t.data && (t.stopPropagation(), n.length > 0))
						{
							var i = n.shift();
							i()
						}
					}, !0),
					function(t)
					{
						n.push(t), window.postMessage("process-tick", "*")
					}
			}
			return function(t)
			{
				setTimeout(t, 0)
			}
		}(), n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.binding = function()
		{
			throw new Error("process.binding is not supported")
		}, n.cwd = function()
		{
			return "/"
		}, n.chdir = function()
		{
			throw new Error("process.chdir is not supported")
		}
	},
	{}],
	23: [function(t, e, n)
	{
		! function(t)
		{
			"use strict";
			var e = {};
			"undefined" == typeof n ? "function" == typeof define && "object" == typeof define.amd && define.amd ? (e.exports = {}, define(function()
				{
					return e.exports
				})) : e.exports = "undefined" != typeof window ? window : t : e.exports = n,
				function(t)
				{
					if (!e) var e = 1e-6;
					if (!n) var n = "undefined" != typeof Float32Array ? Float32Array : Array;
					if (!i) var i = Math.random;
					var r = {};
					r.setMatrixArrayType = function(t)
					{
						n = t
					}, "undefined" != typeof t && (t.glMatrix = r);
					var o = Math.PI / 180;
					r.toRadian = function(t)
					{
						return t * o
					};
					var s = {};
					s.create = function()
					{
						var t = new n(2);
						return t[0] = 0, t[1] = 0, t
					}, s.clone = function(t)
					{
						var e = new n(2);
						return e[0] = t[0], e[1] = t[1], e
					}, s.fromValues = function(t, e)
					{
						var i = new n(2);
						return i[0] = t, i[1] = e, i
					}, s.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t
					}, s.set = function(t, e, n)
					{
						return t[0] = e, t[1] = n, t
					}, s.add = function(t, e, n)
					{
						return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t
					}, s.subtract = function(t, e, n)
					{
						return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t
					}, s.sub = s.subtract, s.multiply = function(t, e, n)
					{
						return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t
					}, s.mul = s.multiply, s.divide = function(t, e, n)
					{
						return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t
					}, s.div = s.divide, s.min = function(t, e, n)
					{
						return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t
					}, s.max = function(t, e, n)
					{
						return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t
					}, s.scale = function(t, e, n)
					{
						return t[0] = e[0] * n, t[1] = e[1] * n, t
					}, s.scaleAndAdd = function(t, e, n, i)
					{
						return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t
					}, s.distance = function(t, e)
					{
						var n = e[0] - t[0],
							i = e[1] - t[1];
						return Math.sqrt(n * n + i * i)
					}, s.dist = s.distance, s.squaredDistance = function(t, e)
					{
						var n = e[0] - t[0],
							i = e[1] - t[1];
						return n * n + i * i
					}, s.sqrDist = s.squaredDistance, s.length = function(t)
					{
						var e = t[0],
							n = t[1];
						return Math.sqrt(e * e + n * n)
					}, s.len = s.length, s.squaredLength = function(t)
					{
						var e = t[0],
							n = t[1];
						return e * e + n * n
					}, s.sqrLen = s.squaredLength, s.negate = function(t, e)
					{
						return t[0] = -e[0], t[1] = -e[1], t
					}, s.normalize = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = n * n + i * i;
						return r > 0 && (r = 1 / Math.sqrt(r), t[0] = e[0] * r, t[1] = e[1] * r), t
					}, s.dot = function(t, e)
					{
						return t[0] * e[0] + t[1] * e[1]
					}, s.cross = function(t, e, n)
					{
						var i = e[0] * n[1] - e[1] * n[0];
						return t[0] = t[1] = 0, t[2] = i, t
					}, s.lerp = function(t, e, n, i)
					{
						var r = e[0],
							o = e[1];
						return t[0] = r + i * (n[0] - r), t[1] = o + i * (n[1] - o), t
					}, s.random = function(t, e)
					{
						e = e || 1;
						var n = 2 * i() * Math.PI;
						return t[0] = Math.cos(n) * e, t[1] = Math.sin(n) * e, t
					}, s.transformMat2 = function(t, e, n)
					{
						var i = e[0],
							r = e[1];
						return t[0] = n[0] * i + n[2] * r, t[1] = n[1] * i + n[3] * r, t
					}, s.transformMat2d = function(t, e, n)
					{
						var i = e[0],
							r = e[1];
						return t[0] = n[0] * i + n[2] * r + n[4], t[1] = n[1] * i + n[3] * r + n[5], t
					}, s.transformMat3 = function(t, e, n)
					{
						var i = e[0],
							r = e[1];
						return t[0] = n[0] * i + n[3] * r + n[6], t[1] = n[1] * i + n[4] * r + n[7], t
					}, s.transformMat4 = function(t, e, n)
					{
						var i = e[0],
							r = e[1];
						return t[0] = n[0] * i + n[4] * r + n[12], t[1] = n[1] * i + n[5] * r + n[13], t
					}, s.forEach = function()
					{
						var t = s.create();
						return function(e, n, i, r, o, s)
						{
							var a, u;
							for (n || (n = 2), i || (i = 0), u = r ? Math.min(r * n + i, e.length) : e.length, a = i; u > a; a += n) t[0] = e[a], t[1] = e[a + 1], o(t, t, s), e[a] = t[0], e[a + 1] = t[1];
							return e
						}
					}(), s.str = function(t)
					{
						return "vec2(" + t[0] + ", " + t[1] + ")"
					}, "undefined" != typeof t && (t.vec2 = s);
					var a = {};
					a.create = function()
					{
						var t = new n(3);
						return t[0] = 0, t[1] = 0, t[2] = 0, t
					}, a.clone = function(t)
					{
						var e = new n(3);
						return e[0] = t[0], e[1] = t[1], e[2] = t[2], e
					}, a.fromValues = function(t, e, i)
					{
						var r = new n(3);
						return r[0] = t, r[1] = e, r[2] = i, r
					}, a.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t
					}, a.set = function(t, e, n, i)
					{
						return t[0] = e, t[1] = n, t[2] = i, t
					}, a.add = function(t, e, n)
					{
						return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t
					}, a.subtract = function(t, e, n)
					{
						return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t
					}, a.sub = a.subtract, a.multiply = function(t, e, n)
					{
						return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t
					}, a.mul = a.multiply, a.divide = function(t, e, n)
					{
						return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t
					}, a.div = a.divide, a.min = function(t, e, n)
					{
						return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t
					}, a.max = function(t, e, n)
					{
						return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t
					}, a.scale = function(t, e, n)
					{
						return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t
					}, a.scaleAndAdd = function(t, e, n, i)
					{
						return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t
					}, a.distance = function(t, e)
					{
						var n = e[0] - t[0],
							i = e[1] - t[1],
							r = e[2] - t[2];
						return Math.sqrt(n * n + i * i + r * r)
					}, a.dist = a.distance, a.squaredDistance = function(t, e)
					{
						var n = e[0] - t[0],
							i = e[1] - t[1],
							r = e[2] - t[2];
						return n * n + i * i + r * r
					}, a.sqrDist = a.squaredDistance, a.length = function(t)
					{
						var e = t[0],
							n = t[1],
							i = t[2];
						return Math.sqrt(e * e + n * n + i * i)
					}, a.len = a.length, a.squaredLength = function(t)
					{
						var e = t[0],
							n = t[1],
							i = t[2];
						return e * e + n * n + i * i
					}, a.sqrLen = a.squaredLength, a.negate = function(t, e)
					{
						return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t
					}, a.normalize = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = n * n + i * i + r * r;
						return o > 0 && (o = 1 / Math.sqrt(o), t[0] = e[0] * o, t[1] = e[1] * o, t[2] = e[2] * o), t
					}, a.dot = function(t, e)
					{
						return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
					}, a.cross = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = n[0],
							a = n[1],
							u = n[2];
						return t[0] = r * u - o * a, t[1] = o * s - i * u, t[2] = i * a - r * s, t
					}, a.lerp = function(t, e, n, i)
					{
						var r = e[0],
							o = e[1],
							s = e[2];
						return t[0] = r + i * (n[0] - r), t[1] = o + i * (n[1] - o), t[2] = s + i * (n[2] - s), t
					}, a.random = function(t, e)
					{
						e = e || 1;
						var n = 2 * i() * Math.PI,
							r = 2 * i() - 1,
							o = Math.sqrt(1 - r * r) * e;
						return t[0] = Math.cos(n) * o, t[1] = Math.sin(n) * o, t[2] = r * e, t
					}, a.transformMat4 = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2];
						return t[0] = n[0] * i + n[4] * r + n[8] * o + n[12], t[1] = n[1] * i + n[5] * r + n[9] * o + n[13], t[2] = n[2] * i + n[6] * r + n[10] * o + n[14], t
					}, a.transformMat3 = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2];
						return t[0] = i * n[0] + r * n[3] + o * n[6], t[1] = i * n[1] + r * n[4] + o * n[7], t[2] = i * n[2] + r * n[5] + o * n[8], t
					}, a.transformQuat = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = n[0],
							a = n[1],
							u = n[2],
							c = n[3],
							l = c * i + a * o - u * r,
							h = c * r + u * i - s * o,
							p = c * o + s * r - a * i,
							f = -s * i - a * r - u * o;
						return t[0] = l * c + f * -s + h * -u - p * -a, t[1] = h * c + f * -a + p * -s - l * -u, t[2] = p * c + f * -u + l * -a - h * -s, t
					}, a.rotateX = function(t, e, n, i)
					{
						var r = [],
							o = [];
						return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], o[0] = r[0], o[1] = r[1] * Math.cos(i) - r[2] * Math.sin(i), o[2] = r[1] * Math.sin(i) + r[2] * Math.cos(i), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
					}, a.rotateY = function(t, e, n, i)
					{
						var r = [],
							o = [];
						return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], o[0] = r[2] * Math.sin(i) + r[0] * Math.cos(i), o[1] = r[1], o[2] = r[2] * Math.cos(i) - r[0] * Math.sin(i), t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
					}, a.rotateZ = function(t, e, n, i)
					{
						var r = [],
							o = [];
						return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], o[0] = r[0] * Math.cos(i) - r[1] * Math.sin(i), o[1] = r[0] * Math.sin(i) + r[1] * Math.cos(i), o[2] = r[2], t[0] = o[0] + n[0], t[1] = o[1] + n[1], t[2] = o[2] + n[2], t
					}, a.forEach = function()
					{
						var t = a.create();
						return function(e, n, i, r, o, s)
						{
							var a, u;
							for (n || (n = 3), i || (i = 0), u = r ? Math.min(r * n + i, e.length) : e.length, a = i; u > a; a += n) t[0] = e[a], t[1] = e[a + 1], t[2] = e[a + 2], o(t, t, s), e[a] = t[0], e[a + 1] = t[1], e[a + 2] = t[2];
							return e
						}
					}(), a.str = function(t)
					{
						return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
					}, "undefined" != typeof t && (t.vec3 = a);
					var u = {};
					u.create = function()
					{
						var t = new n(4);
						return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t
					}, u.clone = function(t)
					{
						var e = new n(4);
						return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
					}, u.fromValues = function(t, e, i, r)
					{
						var o = new n(4);
						return o[0] = t, o[1] = e, o[2] = i, o[3] = r, o
					}, u.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
					}, u.set = function(t, e, n, i, r)
					{
						return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t
					}, u.add = function(t, e, n)
					{
						return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t
					}, u.subtract = function(t, e, n)
					{
						return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t
					}, u.sub = u.subtract, u.multiply = function(t, e, n)
					{
						return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t[3] = e[3] * n[3], t
					}, u.mul = u.multiply, u.divide = function(t, e, n)
					{
						return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t[3] = e[3] / n[3], t
					}, u.div = u.divide, u.min = function(t, e, n)
					{
						return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t[3] = Math.min(e[3], n[3]), t
					}, u.max = function(t, e, n)
					{
						return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t[3] = Math.max(e[3], n[3]), t
					}, u.scale = function(t, e, n)
					{
						return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t
					}, u.scaleAndAdd = function(t, e, n, i)
					{
						return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t
					}, u.distance = function(t, e)
					{
						var n = e[0] - t[0],
							i = e[1] - t[1],
							r = e[2] - t[2],
							o = e[3] - t[3];
						return Math.sqrt(n * n + i * i + r * r + o * o)
					}, u.dist = u.distance, u.squaredDistance = function(t, e)
					{
						var n = e[0] - t[0],
							i = e[1] - t[1],
							r = e[2] - t[2],
							o = e[3] - t[3];
						return n * n + i * i + r * r + o * o
					}, u.sqrDist = u.squaredDistance, u.length = function(t)
					{
						var e = t[0],
							n = t[1],
							i = t[2],
							r = t[3];
						return Math.sqrt(e * e + n * n + i * i + r * r)
					}, u.len = u.length, u.squaredLength = function(t)
					{
						var e = t[0],
							n = t[1],
							i = t[2],
							r = t[3];
						return e * e + n * n + i * i + r * r
					}, u.sqrLen = u.squaredLength, u.negate = function(t, e)
					{
						return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t
					}, u.normalize = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = n * n + i * i + r * r + o * o;
						return s > 0 && (s = 1 / Math.sqrt(s), t[0] = e[0] * s, t[1] = e[1] * s, t[2] = e[2] * s, t[3] = e[3] * s), t
					}, u.dot = function(t, e)
					{
						return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
					}, u.lerp = function(t, e, n, i)
					{
						var r = e[0],
							o = e[1],
							s = e[2],
							a = e[3];
						return t[0] = r + i * (n[0] - r), t[1] = o + i * (n[1] - o), t[2] = s + i * (n[2] - s), t[3] = a + i * (n[3] - a), t
					}, u.random = function(t, e)
					{
						return e = e || 1, t[0] = i(), t[1] = i(), t[2] = i(), t[3] = i(), u.normalize(t, t), u.scale(t, t, e), t
					}, u.transformMat4 = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3];
						return t[0] = n[0] * i + n[4] * r + n[8] * o + n[12] * s, t[1] = n[1] * i + n[5] * r + n[9] * o + n[13] * s, t[2] = n[2] * i + n[6] * r + n[10] * o + n[14] * s, t[3] = n[3] * i + n[7] * r + n[11] * o + n[15] * s, t
					}, u.transformQuat = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = n[0],
							a = n[1],
							u = n[2],
							c = n[3],
							l = c * i + a * o - u * r,
							h = c * r + u * i - s * o,
							p = c * o + s * r - a * i,
							f = -s * i - a * r - u * o;
						return t[0] = l * c + f * -s + h * -u - p * -a, t[1] = h * c + f * -a + p * -s - l * -u, t[2] = p * c + f * -u + l * -a - h * -s, t
					}, u.forEach = function()
					{
						var t = u.create();
						return function(e, n, i, r, o, s)
						{
							var a, u;
							for (n || (n = 4), i || (i = 0), u = r ? Math.min(r * n + i, e.length) : e.length, a = i; u > a; a += n) t[0] = e[a], t[1] = e[a + 1], t[2] = e[a + 2], t[3] = e[a + 3], o(t, t, s), e[a] = t[0], e[a + 1] = t[1], e[a + 2] = t[2], e[a + 3] = t[3];
							return e
						}
					}(), u.str = function(t)
					{
						return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
					}, "undefined" != typeof t && (t.vec4 = u);
					var c = {};
					c.create = function()
					{
						var t = new n(4);
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
					}, c.clone = function(t)
					{
						var e = new n(4);
						return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e
					}, c.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t
					}, c.identity = function(t)
					{
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
					}, c.transpose = function(t, e)
					{
						if (t === e)
						{
							var n = e[1];
							t[1] = e[2], t[2] = n
						}
						else t[0] = e[0], t[1] = e[2], t[2] = e[1], t[3] = e[3];
						return t
					}, c.invert = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = n * o - r * i;
						return s ? (s = 1 / s, t[0] = o * s, t[1] = -i * s, t[2] = -r * s, t[3] = n * s, t) : null
					}, c.adjoint = function(t, e)
					{
						var n = e[0];
						return t[0] = e[3], t[1] = -e[1], t[2] = -e[2], t[3] = n, t
					}, c.determinant = function(t)
					{
						return t[0] * t[3] - t[2] * t[1]
					}, c.multiply = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = n[0],
							u = n[1],
							c = n[2],
							l = n[3];
						return t[0] = i * a + o * u, t[1] = r * a + s * u, t[2] = i * c + o * l, t[3] = r * c + s * l, t
					}, c.mul = c.multiply, c.rotate = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = Math.sin(n),
							u = Math.cos(n);
						return t[0] = i * u + o * a, t[1] = r * u + s * a, t[2] = i * -a + o * u, t[3] = r * -a + s * u, t
					}, c.scale = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = n[0],
							u = n[1];
						return t[0] = i * a, t[1] = r * a, t[2] = o * u, t[3] = s * u, t
					}, c.str = function(t)
					{
						return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
					}, c.frob = function(t)
					{
						return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2))
					}, c.LDU = function(t, e, n, i)
					{
						return t[2] = i[2] / i[0], n[0] = i[0], n[1] = i[1], n[3] = i[3] - t[2] * n[1], [t, e, n]
					}, "undefined" != typeof t && (t.mat2 = c);
					var l = {};
					l.create = function()
					{
						var t = new n(6);
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
					}, l.clone = function(t)
					{
						var e = new n(6);
						return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e
					}, l.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t
					}, l.identity = function(t)
					{
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
					}, l.invert = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = e[4],
							a = e[5],
							u = n * o - i * r;
						return u ? (u = 1 / u, t[0] = o * u, t[1] = -i * u, t[2] = -r * u, t[3] = n * u, t[4] = (r * a - o * s) * u, t[5] = (i * s - n * a) * u, t) : null
					}, l.determinant = function(t)
					{
						return t[0] * t[3] - t[1] * t[2]
					}, l.multiply = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = n[0],
							l = n[1],
							h = n[2],
							p = n[3],
							f = n[4],
							d = n[5];
						return t[0] = i * c + o * l, t[1] = r * c + s * l, t[2] = i * h + o * p, t[3] = r * h + s * p, t[4] = i * f + o * d + a, t[5] = r * f + s * d + u, t
					}, l.mul = l.multiply, l.rotate = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = Math.sin(n),
							l = Math.cos(n);
						return t[0] = i * l + o * c, t[1] = r * l + s * c, t[2] = i * -c + o * l, t[3] = r * -c + s * l, t[4] = a, t[5] = u, t
					}, l.scale = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = n[0],
							l = n[1];
						return t[0] = i * c, t[1] = r * c, t[2] = o * l, t[3] = s * l, t[4] = a, t[5] = u, t
					}, l.translate = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = n[0],
							l = n[1];
						return t[0] = i, t[1] = r, t[2] = o, t[3] = s, t[4] = i * c + o * l + a, t[5] = r * c + s * l + u, t
					}, l.str = function(t)
					{
						return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")"
					}, l.frob = function(t)
					{
						return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1)
					}, "undefined" != typeof t && (t.mat2d = l);
					var h = {};
					h.create = function()
					{
						var t = new n(9);
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
					}, h.fromMat4 = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t
					}, h.clone = function(t)
					{
						var e = new n(9);
						return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e
					}, h.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
					}, h.identity = function(t)
					{
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
					}, h.transpose = function(t, e)
					{
						if (t === e)
						{
							var n = e[1],
								i = e[2],
								r = e[5];
							t[1] = e[3], t[2] = e[6], t[3] = n, t[5] = e[7], t[6] = i, t[7] = r
						}
						else t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8];
						return t
					}, h.invert = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = e[4],
							a = e[5],
							u = e[6],
							c = e[7],
							l = e[8],
							h = l * s - a * c,
							p = -l * o + a * u,
							f = c * o - s * u,
							d = n * h + i * p + r * f;
						return d ? (d = 1 / d, t[0] = h * d, t[1] = (-l * i + r * c) * d, t[2] = (a * i - r * s) * d, t[3] = p * d, t[4] = (l * n - r * u) * d, t[5] = (-a * n + r * o) * d, t[6] = f * d, t[7] = (-c * n + i * u) * d, t[8] = (s * n - i * o) * d, t) : null
					}, h.adjoint = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = e[4],
							a = e[5],
							u = e[6],
							c = e[7],
							l = e[8];
						return t[0] = s * l - a * c, t[1] = r * c - i * l, t[2] = i * a - r * s, t[3] = a * u - o * l, t[4] = n * l - r * u, t[5] = r * o - n * a, t[6] = o * c - s * u, t[7] = i * u - n * c, t[8] = n * s - i * o, t
					}, h.determinant = function(t)
					{
						var e = t[0],
							n = t[1],
							i = t[2],
							r = t[3],
							o = t[4],
							s = t[5],
							a = t[6],
							u = t[7],
							c = t[8];
						return e * (c * o - s * u) + n * (-c * r + s * a) + i * (u * r - o * a)
					}, h.multiply = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = e[6],
							l = e[7],
							h = e[8],
							p = n[0],
							f = n[1],
							d = n[2],
							m = n[3],
							v = n[4],
							g = n[5],
							y = n[6],
							w = n[7],
							b = n[8];
						return t[0] = p * i + f * s + d * c, t[1] = p * r + f * a + d * l, t[2] = p * o + f * u + d * h, t[3] = m * i + v * s + g * c, t[4] = m * r + v * a + g * l, t[5] = m * o + v * u + g * h, t[6] = y * i + w * s + b * c, t[7] = y * r + w * a + b * l, t[8] = y * o + w * u + b * h, t
					}, h.mul = h.multiply, h.translate = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = e[6],
							l = e[7],
							h = e[8],
							p = n[0],
							f = n[1];
						return t[0] = i, t[1] = r, t[2] = o, t[3] = s, t[4] = a, t[5] = u, t[6] = p * i + f * s + c, t[7] = p * r + f * a + l, t[8] = p * o + f * u + h, t
					}, h.rotate = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = e[6],
							l = e[7],
							h = e[8],
							p = Math.sin(n),
							f = Math.cos(n);
						return t[0] = f * i + p * s, t[1] = f * r + p * a, t[2] = f * o + p * u, t[3] = f * s - p * i, t[4] = f * a - p * r, t[5] = f * u - p * o, t[6] = c, t[7] = l, t[8] = h, t
					}, h.scale = function(t, e, n)
					{
						var i = n[0],
							r = n[1];
						return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = r * e[3], t[4] = r * e[4], t[5] = r * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
					}, h.fromMat2d = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = 0, t[3] = e[2], t[4] = e[3], t[5] = 0, t[6] = e[4], t[7] = e[5], t[8] = 1, t
					}, h.fromQuat = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = n + n,
							a = i + i,
							u = r + r,
							c = n * s,
							l = i * s,
							h = i * a,
							p = r * s,
							f = r * a,
							d = r * u,
							m = o * s,
							v = o * a,
							g = o * u;
						return t[0] = 1 - h - d, t[3] = l - g, t[6] = p + v, t[1] = l + g, t[4] = 1 - c - d, t[7] = f - m, t[2] = p - v, t[5] = f + m, t[8] = 1 - c - h, t
					}, h.normalFromMat4 = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = e[4],
							a = e[5],
							u = e[6],
							c = e[7],
							l = e[8],
							h = e[9],
							p = e[10],
							f = e[11],
							d = e[12],
							m = e[13],
							v = e[14],
							g = e[15],
							y = n * a - i * s,
							w = n * u - r * s,
							b = n * c - o * s,
							x = i * u - r * a,
							M = i * c - o * a,
							_ = r * c - o * u,
							F = l * m - h * d,
							E = l * v - p * d,
							S = l * g - f * d,
							P = h * v - p * m,
							k = h * g - f * m,
							A = p * g - f * v,
							z = y * A - w * k + b * P + x * S - M * E + _ * F;
						return z ? (z = 1 / z, t[0] = (a * A - u * k + c * P) * z, t[1] = (u * S - s * A - c * E) * z, t[2] = (s * k - a * S + c * F) * z, t[3] = (r * k - i * A - o * P) * z, t[4] = (n * A - r * S + o * E) * z, t[5] = (i * S - n * k - o * F) * z, t[6] = (m * _ - v * M + g * x) * z, t[7] = (v * b - d * _ - g * w) * z, t[8] = (d * M - m * b + g * y) * z, t) : null
					}, h.str = function(t)
					{
						return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
					}, h.frob = function(t)
					{
						return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
					}, "undefined" != typeof t && (t.mat3 = h);
					var p = {};
					p.create = function()
					{
						var t = new n(16);
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
					}, p.clone = function(t)
					{
						var e = new n(16);
						return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
					}, p.copy = function(t, e)
					{
						return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
					}, p.identity = function(t)
					{
						return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
					}, p.transpose = function(t, e)
					{
						if (t === e)
						{
							var n = e[1],
								i = e[2],
								r = e[3],
								o = e[6],
								s = e[7],
								a = e[11];
							t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = i, t[9] = o, t[11] = e[14], t[12] = r, t[13] = s, t[14] = a
						}
						else t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15];
						return t
					}, p.invert = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = e[4],
							a = e[5],
							u = e[6],
							c = e[7],
							l = e[8],
							h = e[9],
							p = e[10],
							f = e[11],
							d = e[12],
							m = e[13],
							v = e[14],
							g = e[15],
							y = n * a - i * s,
							w = n * u - r * s,
							b = n * c - o * s,
							x = i * u - r * a,
							M = i * c - o * a,
							_ = r * c - o * u,
							F = l * m - h * d,
							E = l * v - p * d,
							S = l * g - f * d,
							P = h * v - p * m,
							k = h * g - f * m,
							A = p * g - f * v,
							z = y * A - w * k + b * P + x * S - M * E + _ * F;
						return z ? (z = 1 / z, t[0] = (a * A - u * k + c * P) * z, t[1] = (r * k - i * A - o * P) * z, t[2] = (m * _ - v * M + g * x) * z, t[3] = (p * M - h * _ - f * x) * z, t[4] = (u * S - s * A - c * E) * z, t[5] = (n * A - r * S + o * E) * z, t[6] = (v * b - d * _ - g * w) * z, t[7] = (l * _ - p * b + f * w) * z, t[8] = (s * k - a * S + c * F) * z, t[9] = (i * S - n * k - o * F) * z, t[10] = (d * M - m * b + g * y) * z, t[11] = (h * b - l * M - f * y) * z, t[12] = (a * E - s * P - u * F) * z, t[13] = (n * P - i * E + r * F) * z, t[14] = (m * w - d * x - v * y) * z, t[15] = (l * x - h * w + p * y) * z, t) : null
					}, p.adjoint = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = e[4],
							a = e[5],
							u = e[6],
							c = e[7],
							l = e[8],
							h = e[9],
							p = e[10],
							f = e[11],
							d = e[12],
							m = e[13],
							v = e[14],
							g = e[15];
						return t[0] = a * (p * g - f * v) - h * (u * g - c * v) + m * (u * f - c * p), t[1] = -(i * (p * g - f * v) - h * (r * g - o * v) + m * (r * f - o * p)), t[2] = i * (u * g - c * v) - a * (r * g - o * v) + m * (r * c - o * u), t[3] = -(i * (u * f - c * p) - a * (r * f - o * p) + h * (r * c - o * u)), t[4] = -(s * (p * g - f * v) - l * (u * g - c * v) + d * (u * f - c * p)), t[5] = n * (p * g - f * v) - l * (r * g - o * v) + d * (r * f - o * p), t[6] = -(n * (u * g - c * v) - s * (r * g - o * v) + d * (r * c - o * u)), t[7] = n * (u * f - c * p) - s * (r * f - o * p) + l * (r * c - o * u), t[8] = s * (h * g - f * m) - l * (a * g - c * m) + d * (a * f - c * h), t[9] = -(n * (h * g - f * m) - l * (i * g - o * m) + d * (i * f - o * h)), t[10] = n * (a * g - c * m) - s * (i * g - o * m) + d * (i * c - o * a), t[11] = -(n * (a * f - c * h) - s * (i * f - o * h) + l * (i * c - o * a)), t[12] = -(s * (h * v - p * m) - l * (a * v - u * m) + d * (a * p - u * h)), t[13] = n * (h * v - p * m) - l * (i * v - r * m) + d * (i * p - r * h), t[14] = -(n * (a * v - u * m) - s * (i * v - r * m) + d * (i * u - r * a)), t[15] = n * (a * p - u * h) - s * (i * p - r * h) + l * (i * u - r * a), t
					}, p.determinant = function(t)
					{
						var e = t[0],
							n = t[1],
							i = t[2],
							r = t[3],
							o = t[4],
							s = t[5],
							a = t[6],
							u = t[7],
							c = t[8],
							l = t[9],
							h = t[10],
							p = t[11],
							f = t[12],
							d = t[13],
							m = t[14],
							v = t[15],
							g = e * s - n * o,
							y = e * a - i * o,
							w = e * u - r * o,
							b = n * a - i * s,
							x = n * u - r * s,
							M = i * u - r * a,
							_ = c * d - l * f,
							F = c * m - h * f,
							E = c * v - p * f,
							S = l * m - h * d,
							P = l * v - p * d,
							k = h * v - p * m;
						return g * k - y * P + w * S + b * E - x * F + M * _
					}, p.multiply = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = e[4],
							u = e[5],
							c = e[6],
							l = e[7],
							h = e[8],
							p = e[9],
							f = e[10],
							d = e[11],
							m = e[12],
							v = e[13],
							g = e[14],
							y = e[15],
							w = n[0],
							b = n[1],
							x = n[2],
							M = n[3];
						return t[0] = w * i + b * a + x * h + M * m, t[1] = w * r + b * u + x * p + M * v, t[2] = w * o + b * c + x * f + M * g, t[3] = w * s + b * l + x * d + M * y, w = n[4], b = n[5], x = n[6], M = n[7], t[4] = w * i + b * a + x * h + M * m, t[5] = w * r + b * u + x * p + M * v, t[6] = w * o + b * c + x * f + M * g, t[7] = w * s + b * l + x * d + M * y, w = n[8], b = n[9], x = n[10], M = n[11], t[8] = w * i + b * a + x * h + M * m, t[9] = w * r + b * u + x * p + M * v, t[10] = w * o + b * c + x * f + M * g, t[11] = w * s + b * l + x * d + M * y, w = n[12], b = n[13], x = n[14], M = n[15], t[12] = w * i + b * a + x * h + M * m, t[13] = w * r + b * u + x * p + M * v, t[14] = w * o + b * c + x * f + M * g, t[15] = w * s + b * l + x * d + M * y, t
					}, p.mul = p.multiply, p.translate = function(t, e, n)
					{
						var i, r, o, s, a, u, c, l, h, p, f, d, m = n[0],
							v = n[1],
							g = n[2];
						return e === t ? (t[12] = e[0] * m + e[4] * v + e[8] * g + e[12], t[13] = e[1] * m + e[5] * v + e[9] * g + e[13], t[14] = e[2] * m + e[6] * v + e[10] * g + e[14], t[15] = e[3] * m + e[7] * v + e[11] * g + e[15]) : (i = e[0], r = e[1], o = e[2], s = e[3], a = e[4], u = e[5], c = e[6], l = e[7], h = e[8], p = e[9], f = e[10], d = e[11], t[0] = i, t[1] = r, t[2] = o, t[3] = s, t[4] = a, t[5] = u, t[6] = c, t[7] = l, t[8] = h, t[9] = p, t[10] = f, t[11] = d, t[12] = i * m + a * v + h * g + e[12], t[13] = r * m + u * v + p * g + e[13], t[14] = o * m + c * v + f * g + e[14], t[15] = s * m + l * v + d * g + e[15]), t
					}, p.scale = function(t, e, n)
					{
						var i = n[0],
							r = n[1],
							o = n[2];
						return t[0] = e[0] * i, t[1] = e[1] * i, t[2] = e[2] * i, t[3] = e[3] * i, t[4] = e[4] * r, t[5] = e[5] * r, t[6] = e[6] * r, t[7] = e[7] * r, t[8] = e[8] * o, t[9] = e[9] * o, t[10] = e[10] * o, t[11] = e[11] * o, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
					}, p.rotate = function(t, n, i, r)
					{
						var o, s, a, u, c, l, h, p, f, d, m, v, g, y, w, b, x, M, _, F, E, S, P, k, A = r[0],
							z = r[1],
							q = r[2],
							I = Math.sqrt(A * A + z * z + q * q);
						return Math.abs(I) < e ? null : (I = 1 / I, A *= I, z *= I, q *= I, o = Math.sin(i), s = Math.cos(i), a = 1 - s, u = n[0], c = n[1], l = n[2], h = n[3], p = n[4], f = n[5], d = n[6], m = n[7], v = n[8], g = n[9], y = n[10], w = n[11], b = A * A * a + s, x = z * A * a + q * o, M = q * A * a - z * o, _ = A * z * a - q * o, F = z * z * a + s, E = q * z * a + A * o, S = A * q * a + z * o, P = z * q * a - A * o, k = q * q * a + s, t[0] = u * b + p * x + v * M, t[1] = c * b + f * x + g * M, t[2] = l * b + d * x + y * M, t[3] = h * b + m * x + w * M, t[4] = u * _ + p * F + v * E, t[5] = c * _ + f * F + g * E, t[6] = l * _ + d * F + y * E, t[7] = h * _ + m * F + w * E, t[8] = u * S + p * P + v * k, t[9] = c * S + f * P + g * k, t[10] = l * S + d * P + y * k, t[11] = h * S + m * P + w * k, n !== t && (t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15]), t)
					}, p.rotateX = function(t, e, n)
					{
						var i = Math.sin(n),
							r = Math.cos(n),
							o = e[4],
							s = e[5],
							a = e[6],
							u = e[7],
							c = e[8],
							l = e[9],
							h = e[10],
							p = e[11];
						return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = o * r + c * i, t[5] = s * r + l * i, t[6] = a * r + h * i, t[7] = u * r + p * i, t[8] = c * r - o * i, t[9] = l * r - s * i, t[10] = h * r - a * i, t[11] = p * r - u * i, t
					}, p.rotateY = function(t, e, n)
					{
						var i = Math.sin(n),
							r = Math.cos(n),
							o = e[0],
							s = e[1],
							a = e[2],
							u = e[3],
							c = e[8],
							l = e[9],
							h = e[10],
							p = e[11];
						return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * r - c * i, t[1] = s * r - l * i, t[2] = a * r - h * i, t[3] = u * r - p * i, t[8] = o * i + c * r, t[9] = s * i + l * r, t[10] = a * i + h * r, t[11] = u * i + p * r, t
					}, p.rotateZ = function(t, e, n)
					{
						var i = Math.sin(n),
							r = Math.cos(n),
							o = e[0],
							s = e[1],
							a = e[2],
							u = e[3],
							c = e[4],
							l = e[5],
							h = e[6],
							p = e[7];
						return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = o * r + c * i, t[1] = s * r + l * i, t[2] = a * r + h * i, t[3] = u * r + p * i, t[4] = c * r - o * i, t[5] = l * r - s * i, t[6] = h * r - a * i, t[7] = p * r - u * i, t
					}, p.fromRotationTranslation = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = i + i,
							u = r + r,
							c = o + o,
							l = i * a,
							h = i * u,
							p = i * c,
							f = r * u,
							d = r * c,
							m = o * c,
							v = s * a,
							g = s * u,
							y = s * c;
						return t[0] = 1 - (f + m), t[1] = h + y, t[2] = p - g, t[3] = 0, t[4] = h - y, t[5] = 1 - (l + m), t[6] = d + v, t[7] = 0, t[8] = p + g, t[9] = d - v, t[10] = 1 - (l + f), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t
					}, p.fromQuat = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = n + n,
							a = i + i,
							u = r + r,
							c = n * s,
							l = i * s,
							h = i * a,
							p = r * s,
							f = r * a,
							d = r * u,
							m = o * s,
							v = o * a,
							g = o * u;
						return t[0] = 1 - h - d, t[1] = l + g, t[2] = p - v, t[3] = 0, t[4] = l - g, t[5] = 1 - c - d, t[6] = f + m, t[7] = 0, t[8] = p + v, t[9] = f - m, t[10] = 1 - c - h, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
					}, p.frustum = function(t, e, n, i, r, o, s)
					{
						var a = 1 / (n - e),
							u = 1 / (r - i),
							c = 1 / (o - s);
						return t[0] = 2 * o * a, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * o * u, t[6] = 0, t[7] = 0, t[8] = (n + e) * a, t[9] = (r + i) * u, t[10] = (s + o) * c, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = s * o * 2 * c, t[15] = 0, t
					}, p.perspective = function(t, e, n, i, r)
					{
						var o = 1 / Math.tan(e / 2),
							s = 1 / (i - r);
						return t[0] = o / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (r + i) * s, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * r * i * s, t[15] = 0, t
					}, p.ortho = function(t, e, n, i, r, o, s)
					{
						var a = 1 / (e - n),
							u = 1 / (i - r),
							c = 1 / (o - s);
						return t[0] = -2 * a, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * u, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * c, t[11] = 0, t[12] = (e + n) * a, t[13] = (r + i) * u, t[14] = (s + o) * c, t[15] = 1, t
					}, p.lookAt = function(t, n, i, r)
					{
						var o, s, a, u, c, l, h, f, d, m, v = n[0],
							g = n[1],
							y = n[2],
							w = r[0],
							b = r[1],
							x = r[2],
							M = i[0],
							_ = i[1],
							F = i[2];
						return Math.abs(v - M) < e && Math.abs(g - _) < e && Math.abs(y - F) < e ? p.identity(t) : (h = v - M, f = g - _, d = y - F, m = 1 / Math.sqrt(h * h + f * f + d * d), h *= m, f *= m, d *= m, o = b * d - x * f, s = x * h - w * d, a = w * f - b * h, m = Math.sqrt(o * o + s * s + a * a), m ? (m = 1 / m, o *= m, s *= m, a *= m) : (o = 0, s = 0, a = 0), u = f * a - d * s, c = d * o - h * a, l = h * s - f * o, m = Math.sqrt(u * u + c * c + l * l), m ? (m = 1 / m, u *= m, c *= m, l *= m) : (u = 0, c = 0, l = 0), t[0] = o, t[1] = u, t[2] = h, t[3] = 0, t[4] = s, t[5] = c, t[6] = f, t[7] = 0, t[8] = a, t[9] = l, t[10] = d, t[11] = 0, t[12] = -(o * v + s * g + a * y), t[13] = -(u * v + c * g + l * y), t[14] = -(h * v + f * g + d * y), t[15] = 1, t)
					}, p.str = function(t)
					{
						return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
					}, p.frob = function(t)
					{
						return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
					}, "undefined" != typeof t && (t.mat4 = p);
					var f = {};
					f.create = function()
					{
						var t = new n(4);
						return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
					}, f.rotationTo = function()
					{
						var t = a.create(),
							e = a.fromValues(1, 0, 0),
							n = a.fromValues(0, 1, 0);
						return function(i, r, o)
						{
							var s = a.dot(r, o);
							return -.999999 > s ? (a.cross(t, e, r), a.length(t) < 1e-6 && a.cross(t, n, r), a.normalize(t, t), f.setAxisAngle(i, t, Math.PI), i) : s > .999999 ? (i[0] = 0, i[1] = 0, i[2] = 0, i[3] = 1, i) : (a.cross(t, r, o), i[0] = t[0], i[1] = t[1], i[2] = t[2], i[3] = 1 + s, f.normalize(i, i))
						}
					}(), f.setAxes = function()
					{
						var t = h.create();
						return function(e, n, i, r)
						{
							return t[0] = i[0], t[3] = i[1], t[6] = i[2], t[1] = r[0], t[4] = r[1], t[7] = r[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], f.normalize(e, f.fromMat3(e, t))
						}
					}(), f.clone = u.clone, f.fromValues = u.fromValues, f.copy = u.copy, f.set = u.set, f.identity = function(t)
					{
						return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
					}, f.setAxisAngle = function(t, e, n)
					{
						n = .5 * n;
						var i = Math.sin(n);
						return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = Math.cos(n), t
					}, f.add = u.add, f.multiply = function(t, e, n)
					{
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = n[0],
							u = n[1],
							c = n[2],
							l = n[3];
						return t[0] = i * l + s * a + r * c - o * u, t[1] = r * l + s * u + o * a - i * c, t[2] = o * l + s * c + i * u - r * a, t[3] = s * l - i * a - r * u - o * c, t
					}, f.mul = f.multiply, f.scale = u.scale, f.rotateX = function(t, e, n)
					{
						n *= .5;
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = Math.sin(n),
							u = Math.cos(n);
						return t[0] = i * u + s * a, t[1] = r * u + o * a, t[2] = o * u - r * a, t[3] = s * u - i * a, t
					}, f.rotateY = function(t, e, n)
					{
						n *= .5;
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = Math.sin(n),
							u = Math.cos(n);
						return t[0] = i * u - o * a, t[1] = r * u + s * a, t[2] = o * u + i * a, t[3] = s * u - r * a, t
					}, f.rotateZ = function(t, e, n)
					{
						n *= .5;
						var i = e[0],
							r = e[1],
							o = e[2],
							s = e[3],
							a = Math.sin(n),
							u = Math.cos(n);
						return t[0] = i * u + r * a, t[1] = r * u - i * a, t[2] = o * u + s * a, t[3] = s * u - o * a, t
					}, f.calculateW = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2];
						return t[0] = n, t[1] = i, t[2] = r, t[3] = -Math.sqrt(Math.abs(1 - n * n - i * i - r * r)), t
					}, f.dot = u.dot, f.lerp = u.lerp, f.slerp = function(t, e, n, i)
					{
						var r, o, s, a, u, c = e[0],
							l = e[1],
							h = e[2],
							p = e[3],
							f = n[0],
							d = n[1],
							m = n[2],
							v = n[3];
						return o = c * f + l * d + h * m + p * v, 0 > o && (o = -o, f = -f, d = -d, m = -m, v = -v), 1 - o > 1e-6 ? (r = Math.acos(o), s = Math.sin(r), a = Math.sin((1 - i) * r) / s, u = Math.sin(i * r) / s) : (a = 1 - i, u = i), t[0] = a * c + u * f, t[1] = a * l + u * d, t[2] = a * h + u * m, t[3] = a * p + u * v, t
					}, f.invert = function(t, e)
					{
						var n = e[0],
							i = e[1],
							r = e[2],
							o = e[3],
							s = n * n + i * i + r * r + o * o,
							a = s ? 1 / s : 0;
						return t[0] = -n * a, t[1] = -i * a, t[2] = -r * a, t[3] = o * a, t
					}, f.conjugate = function(t, e)
					{
						return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t
					}, f.length = u.length, f.len = f.length, f.squaredLength = u.squaredLength, f.sqrLen = f.squaredLength, f.normalize = u.normalize, f.fromMat3 = function(t, e)
					{
						var n, i = e[0] + e[4] + e[8];
						if (i > 0) n = Math.sqrt(i + 1), t[3] = .5 * n, n = .5 / n, t[0] = (e[7] - e[5]) * n, t[1] = (e[2] - e[6]) * n, t[2] = (e[3] - e[1]) * n;
						else
						{
							var r = 0;
							e[4] > e[0] && (r = 1), e[8] > e[3 * r + r] && (r = 2);
							var o = (r + 1) % 3,
								s = (r + 2) % 3;
							n = Math.sqrt(e[3 * r + r] - e[3 * o + o] - e[3 * s + s] + 1), t[r] = .5 * n, n = .5 / n, t[3] = (e[3 * s + o] - e[3 * o + s]) * n, t[o] = (e[3 * o + r] + e[3 * r + o]) * n, t[s] = (e[3 * s + r] + e[3 * r + s]) * n
						}
						return t
					}, f.str = function(t)
					{
						return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
					}, "undefined" != typeof t && (t.quat = f)
				}(e.exports)
		}(this)
	},
	{}],
	24: [function(t, e, n)
	{
		(function()
		{
			var t = this,
				i = t._,
				r = {},
				o = Array.prototype,
				s = Object.prototype,
				a = Function.prototype,
				u = o.push,
				c = o.slice,
				l = o.concat,
				h = s.toString,
				p = s.hasOwnProperty,
				f = o.forEach,
				d = o.map,
				m = o.reduce,
				v = o.reduceRight,
				g = o.filter,
				y = o.every,
				w = o.some,
				b = o.indexOf,
				x = o.lastIndexOf,
				M = Array.isArray,
				_ = Object.keys,
				F = a.bind,
				E = function(t)
				{
					return t instanceof E ? t : this instanceof E ? void(this._wrapped = t) : new E(t)
				};
			"undefined" != typeof n ? ("undefined" != typeof e && e.exports && (n = e.exports = E), n._ = E) : t._ = E, E.VERSION = "1.4.4";
			var S = E.each = E.forEach = function(t, e, n)
			{
				if (null != t)
					if (f && t.forEach === f) t.forEach(e, n);
					else if (t.length === +t.length)
				{
					for (var i = 0, o = t.length; o > i; i++)
						if (e.call(n, t[i], i, t) === r) return
				}
				else
					for (var s in t)
						if (E.has(t, s) && e.call(n, t[s], s, t) === r) return
			};
			E.map = E.collect = function(t, e, n)
			{
				var i = [];
				return null == t ? i : d && t.map === d ? t.map(e, n) : (S(t, function(t, r, o)
				{
					i[i.length] = e.call(n, t, r, o)
				}), i)
			};
			var P = "Reduce of empty array with no initial value";
			E.reduce = E.foldl = E.inject = function(t, e, n, i)
			{
				var r = arguments.length > 2;
				if (null == t && (t = []), m && t.reduce === m) return i && (e = E.bind(e, i)), r ? t.reduce(e, n) : t.reduce(e);
				if (S(t, function(t, o, s)
					{
						r ? n = e.call(i, n, t, o, s) : (n = t, r = !0)
					}), !r) throw new TypeError(P);
				return n
			}, E.reduceRight = E.foldr = function(t, e, n, i)
			{
				var r = arguments.length > 2;
				if (null == t && (t = []), v && t.reduceRight === v) return i && (e = E.bind(e, i)), r ? t.reduceRight(e, n) : t.reduceRight(e);
				var o = t.length;
				if (o !== +o)
				{
					var s = E.keys(t);
					o = s.length
				}
				if (S(t, function(a, u, c)
					{
						u = s ? s[--o] : --o, r ? n = e.call(i, n, t[u], u, c) : (n = t[u], r = !0)
					}), !r) throw new TypeError(P);
				return n
			}, E.find = E.detect = function(t, e, n)
			{
				var i;
				return k(t, function(t, r, o)
				{
					return e.call(n, t, r, o) ? (i = t, !0) : void 0
				}), i
			}, E.filter = E.select = function(t, e, n)
			{
				var i = [];
				return null == t ? i : g && t.filter === g ? t.filter(e, n) : (S(t, function(t, r, o)
				{
					e.call(n, t, r, o) && (i[i.length] = t)
				}), i)
			}, E.reject = function(t, e, n)
			{
				return E.filter(t, function(t, i, r)
				{
					return !e.call(n, t, i, r)
				}, n)
			}, E.every = E.all = function(t, e, n)
			{
				e || (e = E.identity);
				var i = !0;
				return null == t ? i : y && t.every === y ? t.every(e, n) : (S(t, function(t, o, s)
				{
					return (i = i && e.call(n, t, o, s)) ? void 0 : r
				}), !!i)
			};
			var k = E.some = E.any = function(t, e, n)
			{
				e || (e = E.identity);
				var i = !1;
				return null == t ? i : w && t.some === w ? t.some(e, n) : (S(t, function(t, o, s)
				{
					return i || (i = e.call(n, t, o, s)) ? r : void 0
				}), !!i)
			};
			E.contains = E.include = function(t, e)
			{
				return null == t ? !1 : b && t.indexOf === b ? -1 != t.indexOf(e) : k(t, function(t)
				{
					return t === e
				})
			}, E.invoke = function(t, e)
			{
				var n = c.call(arguments, 2),
					i = E.isFunction(e);
				return E.map(t, function(t)
				{
					return (i ? e : t[e]).apply(t, n)
				})
			}, E.pluck = function(t, e)
			{
				return E.map(t, function(t)
				{
					return t[e]
				})
			}, E.where = function(t, e, n)
			{
				return E.isEmpty(e) ? n ? null : [] : E[n ? "find" : "filter"](t, function(t)
				{
					for (var n in e)
						if (e[n] !== t[n]) return !1;
					return !0
				})
			}, E.findWhere = function(t, e)
			{
				return E.where(t, e, !0)
			}, E.max = function(t, e, n)
			{
				if (!e && E.isArray(t) && t[0] === +t[0] && t.length < 65535) return Math.max.apply(Math, t);
				if (!e && E.isEmpty(t)) return -1 / 0;
				var i = {
					computed: -1 / 0,
					value: -1 / 0
				};
				return S(t, function(t, r, o)
				{
					var s = e ? e.call(n, t, r, o) : t;
					s >= i.computed && (i = {
						value: t,
						computed: s
					})
				}), i.value
			}, E.min = function(t, e, n)
			{
				if (!e && E.isArray(t) && t[0] === +t[0] && t.length < 65535) return Math.min.apply(Math, t);
				if (!e && E.isEmpty(t)) return 1 / 0;
				var i = {
					computed: 1 / 0,
					value: 1 / 0
				};
				return S(t, function(t, r, o)
				{
					var s = e ? e.call(n, t, r, o) : t;
					s < i.computed && (i = {
						value: t,
						computed: s
					})
				}), i.value
			}, E.shuffle = function(t)
			{
				var e, n = 0,
					i = [];
				return S(t, function(t)
				{
					e = E.random(n++), i[n - 1] = i[e], i[e] = t
				}), i
			};
			var A = function(t)
			{
				return E.isFunction(t) ? t : function(e)
				{
					return e[t]
				}
			};
			E.sortBy = function(t, e, n)
			{
				var i = A(e);
				return E.pluck(E.map(t, function(t, e, r)
				{
					return {
						value: t,
						index: e,
						criteria: i.call(n, t, e, r)
					}
				}).sort(function(t, e)
				{
					var n = t.criteria,
						i = e.criteria;
					if (n !== i)
					{
						if (n > i || void 0 === n) return 1;
						if (i > n || void 0 === i) return -1
					}
					return t.index < e.index ? -1 : 1
				}), "value")
			};
			var z = function(t, e, n, i)
			{
				var r = {},
					o = A(e || E.identity);
				return S(t, function(e, s)
				{
					var a = o.call(n, e, s, t);
					i(r, a, e)
				}), r
			};
			E.groupBy = function(t, e, n)
			{
				return z(t, e, n, function(t, e, n)
				{
					(E.has(t, e) ? t[e] : t[e] = []).push(n)
				})
			}, E.countBy = function(t, e, n)
			{
				return z(t, e, n, function(t, e)
				{
					E.has(t, e) || (t[e] = 0), t[e]++
				})
			}, E.sortedIndex = function(t, e, n, i)
			{
				n = null == n ? E.identity : A(n);
				for (var r = n.call(i, e), o = 0, s = t.length; s > o;)
				{
					var a = o + s >>> 1;
					n.call(i, t[a]) < r ? o = a + 1 : s = a
				}
				return o
			}, E.toArray = function(t)
			{
				return t ? E.isArray(t) ? c.call(t) : t.length === +t.length ? E.map(t, E.identity) : E.values(t) : []
			}, E.size = function(t)
			{
				return null == t ? 0 : t.length === +t.length ? t.length : E.keys(t).length
			}, E.first = E.head = E.take = function(t, e, n)
			{
				return null == t ? void 0 : null == e || n ? t[0] : c.call(t, 0, e)
			}, E.initial = function(t, e, n)
			{
				return c.call(t, 0, t.length - (null == e || n ? 1 : e))
			}, E.last = function(t, e, n)
			{
				return null == t ? void 0 : null == e || n ? t[t.length - 1] : c.call(t, Math.max(t.length - e, 0))
			}, E.rest = E.tail = E.drop = function(t, e, n)
			{
				return c.call(t, null == e || n ? 1 : e)
			}, E.compact = function(t)
			{
				return E.filter(t, E.identity)
			};
			var q = function(t, e, n)
			{
				return S(t, function(t)
				{
					E.isArray(t) ? e ? u.apply(n, t) : q(t, e, n) : n.push(t)
				}), n
			};
			E.flatten = function(t, e)
			{
				return q(t, e, [])
			}, E.without = function(t)
			{
				return E.difference(t, c.call(arguments, 1))
			}, E.uniq = E.unique = function(t, e, n, i)
			{
				E.isFunction(e) && (i = n, n = e, e = !1);
				var r = n ? E.map(t, n, i) : t,
					o = [],
					s = [];
				return S(r, function(n, i)
				{
					(e ? i && s[s.length - 1] === n : E.contains(s, n)) || (s.push(n), o.push(t[i]))
				}), o
			}, E.union = function()
			{
				return E.uniq(l.apply(o, arguments))
			}, E.intersection = function(t)
			{
				var e = c.call(arguments, 1);
				return E.filter(E.uniq(t), function(t)
				{
					return E.every(e, function(e)
					{
						return E.indexOf(e, t) >= 0
					})
				})
			}, E.difference = function(t)
			{
				var e = l.apply(o, c.call(arguments, 1));
				return E.filter(t, function(t)
				{
					return !E.contains(e, t)
				})
			}, E.zip = function()
			{
				for (var t = c.call(arguments), e = E.max(E.pluck(t, "length")), n = new Array(e), i = 0; e > i; i++) n[i] = E.pluck(t, "" + i);
				return n
			}, E.object = function(t, e)
			{
				if (null == t) return {};
				for (var n = {}, i = 0, r = t.length; r > i; i++) e ? n[t[i]] = e[i] : n[t[i][0]] = t[i][1];
				return n
			}, E.indexOf = function(t, e, n)
			{
				if (null == t) return -1;
				var i = 0,
					r = t.length;
				if (n)
				{
					if ("number" != typeof n) return i = E.sortedIndex(t, e), t[i] === e ? i : -1;
					i = 0 > n ? Math.max(0, r + n) : n
				}
				if (b && t.indexOf === b) return t.indexOf(e, n);
				for (; r > i; i++)
					if (t[i] === e) return i;
				return -1
			}, E.lastIndexOf = function(t, e, n)
			{
				if (null == t) return -1;
				var i = null != n;
				if (x && t.lastIndexOf === x) return i ? t.lastIndexOf(e, n) : t.lastIndexOf(e);
				for (var r = i ? n : t.length; r--;)
					if (t[r] === e) return r;
				return -1
			}, E.range = function(t, e, n)
			{
				arguments.length <= 1 && (e = t || 0, t = 0), n = arguments[2] || 1;
				for (var i = Math.max(Math.ceil((e - t) / n), 0), r = 0, o = new Array(i); i > r;) o[r++] = t, t += n;
				return o
			}, E.bind = function(t, e)
			{
				if (t.bind === F && F) return F.apply(t, c.call(arguments, 1));
				var n = c.call(arguments, 2);
				return function()
				{
					return t.apply(e, n.concat(c.call(arguments)))
				}
			}, E.partial = function(t)
			{
				var e = c.call(arguments, 1);
				return function()
				{
					return t.apply(this, e.concat(c.call(arguments)))
				}
			}, E.bindAll = function(t)
			{
				var e = c.call(arguments, 1);
				return 0 === e.length && (e = E.functions(t)), S(e, function(e)
				{
					t[e] = E.bind(t[e], t)
				}), t
			}, E.memoize = function(t, e)
			{
				var n = {};
				return e || (e = E.identity),
					function()
					{
						var i = e.apply(this, arguments);
						return E.has(n, i) ? n[i] : n[i] = t.apply(this, arguments)
					}
			}, E.delay = function(t, e)
			{
				var n = c.call(arguments, 2);
				return setTimeout(function()
				{
					return t.apply(null, n)
				}, e)
			}, E.defer = function(t)
			{
				return E.delay.apply(E, [t, 1].concat(c.call(arguments, 1)))
			}, E.throttle = function(t, e)
			{
				var n, i, r, o, s = 0,
					a = function()
					{
						s = new Date, r = null, o = t.apply(n, i)
					};
				return function()
				{
					var u = new Date,
						c = e - (u - s);
					return n = this, i = arguments, 0 >= c ? (clearTimeout(r), r = null, s = u, o = t.apply(n, i)) : r || (r = setTimeout(a, c)), o
				}
			}, E.debounce = function(t, e, n)
			{
				var i, r;
				return function()
				{
					var o = this,
						s = arguments,
						a = function()
						{
							i = null, n || (r = t.apply(o, s))
						},
						u = n && !i;
					return clearTimeout(i), i = setTimeout(a, e), u && (r = t.apply(o, s)), r
				}
			}, E.once = function(t)
			{
				var e, n = !1;
				return function()
				{
					return n ? e : (n = !0, e = t.apply(this, arguments), t = null, e)
				}
			}, E.wrap = function(t, e)
			{
				return function()
				{
					var n = [t];
					return u.apply(n, arguments), e.apply(this, n)
				}
			}, E.compose = function()
			{
				var t = arguments;
				return function()
				{
					for (var e = arguments, n = t.length - 1; n >= 0; n--) e = [t[n].apply(this, e)];
					return e[0]
				}
			}, E.after = function(t, e)
			{
				return 0 >= t ? e() : function()
				{
					return --t < 1 ? e.apply(this, arguments) : void 0
				}
			}, E.keys = _ || function(t)
			{
				if (t !== Object(t)) throw new TypeError("Invalid object");
				var e = [];
				for (var n in t) E.has(t, n) && (e[e.length] = n);
				return e
			}, E.values = function(t)
			{
				var e = [];
				for (var n in t) E.has(t, n) && e.push(t[n]);
				return e
			}, E.pairs = function(t)
			{
				var e = [];
				for (var n in t) E.has(t, n) && e.push([n, t[n]]);
				return e
			}, E.invert = function(t)
			{
				var e = {};
				for (var n in t) E.has(t, n) && (e[t[n]] = n);
				return e
			}, E.functions = E.methods = function(t)
			{
				var e = [];
				for (var n in t) E.isFunction(t[n]) && e.push(n);
				return e.sort()
			}, E.extend = function(t)
			{
				return S(c.call(arguments, 1), function(e)
				{
					if (e)
						for (var n in e) t[n] = e[n]
				}), t
			}, E.pick = function(t)
			{
				var e = {},
					n = l.apply(o, c.call(arguments, 1));
				return S(n, function(n)
				{
					n in t && (e[n] = t[n])
				}), e
			}, E.omit = function(t)
			{
				var e = {},
					n = l.apply(o, c.call(arguments, 1));
				for (var i in t) E.contains(n, i) || (e[i] = t[i]);
				return e
			}, E.defaults = function(t)
			{
				return S(c.call(arguments, 1), function(e)
				{
					if (e)
						for (var n in e) null == t[n] && (t[n] = e[n])
				}), t
			}, E.clone = function(t)
			{
				return E.isObject(t) ? E.isArray(t) ? t.slice() : E.extend(
				{}, t) : t
			}, E.tap = function(t, e)
			{
				return e(t), t
			};
			var I = function(t, e, n, i)
			{
				if (t === e) return 0 !== t || 1 / t == 1 / e;
				if (null == t || null == e) return t === e;
				t instanceof E && (t = t._wrapped), e instanceof E && (e = e._wrapped);
				var r = h.call(t);
				if (r != h.call(e)) return !1;
				switch (r)
				{
					case "[object String]":
						return t == String(e);
					case "[object Number]":
						return t != +t ? e != +e : 0 == t ? 1 / t == 1 / e : t == +e;
					case "[object Date]":
					case "[object Boolean]":
						return +t == +e;
					case "[object RegExp]":
						return t.source == e.source && t.global == e.global && t.multiline == e.multiline && t.ignoreCase == e.ignoreCase
				}
				if ("object" != typeof t || "object" != typeof e) return !1;
				for (var o = n.length; o--;)
					if (n[o] == t) return i[o] == e;
				n.push(t), i.push(e);
				var s = 0,
					a = !0;
				if ("[object Array]" == r)
				{
					if (s = t.length, a = s == e.length)
						for (; s-- && (a = I(t[s], e[s], n, i)););
				}
				else
				{
					var u = t.constructor,
						c = e.constructor;
					if (u !== c && !(E.isFunction(u) && u instanceof u && E.isFunction(c) && c instanceof c)) return !1;
					for (var l in t)
						if (E.has(t, l) && (s++, !(a = E.has(e, l) && I(t[l], e[l], n, i)))) break;
					if (a)
					{
						for (l in e)
							if (E.has(e, l) && !s--) break;
						a = !s
					}
				}
				return n.pop(), i.pop(), a
			};
			E.isEqual = function(t, e)
			{
				return I(t, e, [], [])
			}, E.isEmpty = function(t)
			{
				if (null == t) return !0;
				if (E.isArray(t) || E.isString(t)) return 0 === t.length;
				for (var e in t)
					if (E.has(t, e)) return !1;
				return !0
			}, E.isElement = function(t)
			{
				return !(!t || 1 !== t.nodeType)
			}, E.isArray = M || function(t)
			{
				return "[object Array]" == h.call(t)
			}, E.isObject = function(t)
			{
				return t === Object(t)
			}, S(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(t)
			{
				E["is" + t] = function(e)
				{
					return h.call(e) == "[object " + t + "]"
				}
			}), E.isArguments(arguments) || (E.isArguments = function(t)
			{
				return !(!t || !E.has(t, "callee"))
			}), "function" != typeof /./ && (E.isFunction = function(t)
			{
				return "function" == typeof t
			}), E.isFinite = function(t)
			{
				return isFinite(t) && !isNaN(parseFloat(t))
			}, E.isNaN = function(t)
			{
				return E.isNumber(t) && t != +t
			}, E.isBoolean = function(t)
			{
				return t === !0 || t === !1 || "[object Boolean]" == h.call(t)
			}, E.isNull = function(t)
			{
				return null === t
			}, E.isUndefined = function(t)
			{
				return void 0 === t
			}, E.has = function(t, e)
			{
				return p.call(t, e)
			}, E.noConflict = function()
			{
				return t._ = i, this
			}, E.identity = function(t)
			{
				return t
			}, E.times = function(t, e, n)
			{
				for (var i = Array(t), r = 0; t > r; r++) i[r] = e.call(n, r);
				return i
			}, E.random = function(t, e)
			{
				return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1))
			};
			var L = {
				escape:
				{
					"&": "&",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#x27;",
					"/": "&#x2F;"
				}
			};
			L.unescape = E.invert(L.escape);
			var j = {
				escape: new RegExp("[" + E.keys(L.escape).join("") + "]", "g"),
				unescape: new RegExp("(" + E.keys(L.unescape).join("|") + ")", "g")
			};
			E.each(["escape", "unescape"], function(t)
			{
				E[t] = function(e)
				{
					return null == e ? "" : ("" + e).replace(j[t], function(e)
					{
						return L[t][e]
					})
				}
			}), E.result = function(t, e)
			{
				if (null == t) return null;
				var n = t[e];
				return E.isFunction(n) ? n.call(t) : n
			}, E.mixin = function(t)
			{
				S(E.functions(t), function(e)
				{
					var n = E[e] = t[e];
					E.prototype[e] = function()
					{
						var t = [this._wrapped];
						return u.apply(t, arguments), B.call(this, n.apply(E, t))
					}
				})
			};
			var O = 0;
			E.uniqueId = function(t)
			{
				var e = ++O + "";
				return t ? t + e : e
			}, E.templateSettings = {
				evaluate: /<%([\s\S]+?)%>/g,
				interpolate: /<%=([\s\S]+?)%>/g,
				escape: /<%-([\s\S]+?)%>/g
			};
			var D = /(.)^/,
				V = {
					"'": "'",
					"\\": "\\",
					"\r": "r",
					"\n": "n",
					"	": "t",
					"\u2028": "u2028",
					"\u2029": "u2029"
				},
				C = /\\|'|\r|\n|\t|\u2028|\u2029/g;
			E.template = function(t, e, n)
			{
				var i;
				n = E.defaults(
				{}, n, E.templateSettings);
				var r = new RegExp([(n.escape || D).source, (n.interpolate || D).source, (n.evaluate || D).source].join("|") + "|$", "g"),
					o = 0,
					s = "__p+='";
				t.replace(r, function(e, n, i, r, a)
				{
					return s += t.slice(o, a).replace(C, function(t)
					{
						return "\\" + V[t]
					}), n && (s += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), i && (s += "'+\n((__t=(" + i + "))==null?'':__t)+\n'"), r && (s += "';\n" + r + "\n__p+='"), o = a + e.length, e
				}), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
				try
				{
					i = new Function(n.variable || "obj", "_", s)
				}
				catch (a)
				{
					throw a.source = s, a
				}
				if (e) return i(e, E);
				var u = function(t)
				{
					return i.call(this, t, E)
				};
				return u.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", u
			}, E.chain = function(t)
			{
				return E(t).chain()
			};
			var B = function(t)
			{
				return this._chain ? E(t).chain() : t
			};
			E.mixin(E), S(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t)
			{
				var e = o[t];
				E.prototype[t] = function()
				{
					var n = this._wrapped;
					return e.apply(n, arguments), "shift" != t && "splice" != t || 0 !== n.length || delete n[0], B.call(this, n)
				}
			}), S(["concat", "join", "slice"], function(t)
			{
				var e = o[t];
				E.prototype[t] = function()
				{
					return B.call(this, e.apply(this._wrapped, arguments))
				}
			}), E.extend(E.prototype,
			{
				chain: function()
				{
					return this._chain = !0, this
				},
				value: function()
				{
					return this._wrapped
				}
			})
		}).call(this)
	},
	{}],
	25: [function(t)
	{
		"undefined" != typeof window && "function" != typeof window.requestAnimationFrame && (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t)
		{
			setTimeout(t, 1e3 / 60)
		}), Leap = t("../lib/index")
	},
	{
		"../lib/index": 11
	}]
},
{}, [25]);

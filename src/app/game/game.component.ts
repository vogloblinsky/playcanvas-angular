import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

declare const pc;

@Component({
    selector: 'app-game',
    template: `
        <a [routerLink]="['/home']">home</a>
        <div #content></div>
    `,
    styles: [],
})
export class GameComponent implements OnInit, AfterViewInit {
    pcApplication;

    CANVAS_ID = 'application-canvas';
    canvas;
    devices;

    @ViewChild('content', { read: ElementRef }) content: ElementRef;

    constructor(private renderer: Renderer2) {}

    ngOnInit() {}

    ngAfterViewInit() {
        console.log('ngAfterViewInit');

        this.initialize();

        this.pcApplication.on('app:configured', () => {
            this.loadScene();
        });
    }

    loadScene() {
        console.log('Loading Scene');
        this.pcApplication.loadScene(window['SCENE_PATH'], (err, scene) => {
            if (!err) {
                // Scene loaded successfully, save it to the store
                console.log('Scene loaded. ');
                // Hide Spash screen
                this.pcApplication.fire('preload:end');
                // Start the app after scene has been loaded and show the canvas
                this.pcApplication.start();
            } else {
                // Error
                console.log('Scene Error: ', err);
            }
        });
    }

    processModules() {
        console.log('processModules');
        window['loadModules'](window['PRELOAD_MODULES'], window['ASSET_PREFIX'], this.configure.bind(this));
    }

    initialize() {
        this.createCanvas();

        window['ASSET_PREFIX'] = 'assets/lockdown/';

        try {
            console.log('try');
            this.createInputDevices();
            this.pcApplication = new pc.Application(this.canvas, {
                elementInput: this.devices.elementInput,
                keyboard: this.devices.keyboard,
                mouse: this.devices.mouse,
                gamepads: this.devices.gamepads,
                touch: this.devices.touch,
                graphicsDeviceOptions: window['CONTEXT_OPTIONS'],
                assetPrefix: window['ASSET_PREFIX'] || '',
                scriptPrefix: window['SCRIPT_PREFIX'] || '',
                scriptsOrder: window['SCRIPTS'] || [],
            });

            if (window['PRELOAD_MODULES'].length > 0) {
                this.processModules();
            } else {
                this.configure();
            }
        } catch (e) {
            if (e instanceof pc.UnsupportedBrowserError) {
                this.displayError(
                    'This page requires a browser that supports WebGL.<br/>' +
                        '<a href="http://get.webgl.org">Click here to find out more.</a>'
                );
            } else if (e instanceof pc.ContextCreationError) {
                this.displayError(
                    "It doesn't appear your computer can support WebGL.<br/>" +
                        '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>'
                );
            } else {
                this.displayError('Could not initialize application. Error: ' + e);
            }

            return;
        }
    }

    createCanvas() {
        console.log('createCanvas');
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', this.CANVAS_ID);
        this.canvas.setAttribute('tabindex', 0);

        // Disable I-bar cursor on click+drag
        this.canvas.onselectstart = function () {
            return false;
        };

        this.renderer.appendChild(this.content.nativeElement, this.canvas);
    }

    createInputDevices() {
        console.log('createInputDevices');
        this.devices = {
            elementInput: new pc.ElementInput(this.canvas, {
                useMouse: window['INPUT_SETTINGS'].useMouse,
                useTouch: window['INPUT_SETTINGS'].useTouch,
            }),
            keyboard: window['INPUT_SETTINGS'].useKeyboard ? new pc.Keyboard(window) : null,
            mouse: window['INPUT_SETTINGS'].useMouse ? new pc.Mouse(this.canvas) : null,
            gamepads: window['INPUT_SETTINGS'].useGamepads ? new pc.GamePads() : null,
            touch: window['INPUT_SETTINGS'].useTouch && pc.platform.touch ? new pc.TouchDevice(this.canvas) : null,
        };
    }

    configureCss(fillMode, width, height) {
        console.log('configureCss');
        // Configure resolution and resize event
        if (this.canvas.classList) {
            this.canvas.classList.add('fill-mode-' + fillMode);
        }

        // css media query for aspect ratio changes
        var css = '@media screen and (min-aspect-ratio: ' + width + '/' + height + ') {';
        css += '    #application-canvas.fill-mode-KEEP_ASPECT {';
        css += '        width: auto;';
        css += '        height: 100%;';
        css += '        margin: 0 auto;';
        css += '    }';
        css += '}';

        // append css to style
        if (document.head.querySelector) {
            document.head.querySelector('style').innerHTML += css;
        }
    }

    reflow() {
        console.log('reflow');
        this.pcApplication.resizeCanvas(this.canvas.width, this.canvas.height);
        this.canvas.style.width = '';
        this.canvas.style.height = '';

        var fillMode = this.pcApplication._fillMode;

        if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
            if (
                (fillMode == pc.FILLMODE_NONE && this.canvas.clientHeight < window.innerHeight) ||
                this.canvas.clientWidth / this.canvas.clientHeight >= window.innerWidth / window.innerHeight
            ) {
                this.canvas.style.marginTop = Math.floor((window.innerHeight - this.canvas.clientHeight) / 2) + 'px';
            } else {
                this.canvas.style.marginTop = '';
            }
        }
    }

    displayError(html) {
        var div = document.createElement('div');

        div.innerHTML = [
            '<table style="background-color: #8CE; width: 100%; height: 100%;">',
            '  <tr>',
            '      <td align="center">',
            '          <div style="display: table-cell; vertical-align: middle;">',
            '              <div style="">' + html + '</div>',
            '          </div>',
            '      </td>',
            '  </tr>',
            '</table>',
        ].join('\n');

        document.body.appendChild(div);
    }

    configure() {
        console.log('configure start');
        this.pcApplication.configure('assets/lockdown/' + window['CONFIG_FILENAME'], (err) => {
            console.log('configure cb');
            if (err) {
                console.error(err);
            }

            this.configureCss(this.pcApplication._fillMode, this.pcApplication._width, this.pcApplication._height);

            // do the first reflow after a timeout because of
            // iOS showing a squished iframe sometimes
            setTimeout(() => {
                console.log('timeout');
                this.reflow();
                this.doPreloadAssets();
            });
        });
    }

    doPreloadAssets() {
        this.pcApplication.preload(
            function (err) {
                if (err) {
                    console.error('Preload Error: ', err);
                }
                // Trigger event when the app is configured and assets are preloaded
                console.log('Assets preloaded.');
                this.pcApplication.fire('app:configured');
            }.bind(this)
        );
    }

    ngOnDestroy() {
        console.log('ngOnDestroy');

        this.pcApplication.destroy();
        this.pcApplication = undefined;

        const cv = document.getElementById('application-canvas');
        if (cv) {
            cv.parentElement.removeChild(cv);
        }
    }
}

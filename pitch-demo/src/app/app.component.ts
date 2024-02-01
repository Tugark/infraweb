import {AfterViewInit, Component as AngularComponent, ElementRef, ViewChild} from '@angular/core';
import {
  Components,
  FragmentIfcLoader,
  SimpleCamera,
  SimpleRaycaster,
  SimpleRenderer,
  SimpleScene, ToastNotification
} from 'openbim-components';

/**
 * Make sure the files are all placed inside src/assets; if the names change, adjust them here as well.
 */
const FILES_TO_LOAD = [
  '1161196_ZSTH_AP_A3_3_A_TU_60_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_EW_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_KAB_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_LRE_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_TU_10_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_TU_20_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_TU_50_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_N_TU_80_EBP.ifc',
  '1161196_ZSTH_AP_A3_3_R_TU_60_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_A_TU_60_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_BTB_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_BTB_02_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_BTB_20_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_EW_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_KAB_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_LRP_01_BH_TUS.ifc',
  '1161196_ZSTH_AP_A3_4_N_TK_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_TU_50_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_N_TU_80_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_R_TU_60_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_T_BTB_01_EBP.ifc',
  '1161196_ZSTH_AP_A3_4_T_TU_50_EBP.ifc'
]

@AngularComponent({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  private readonly components: Components
  private fragmentIfcLoader?: FragmentIfcLoader;

  constructor() {
    this.components = new Components();
    this.components.scene = new SimpleScene(this.components);
  }

  public async ngAfterViewInit() {
    this.initializeScene();
    await this.initializeFragmentIfcLoader()
    for (const fileToLoad of FILES_TO_LOAD) {
      await this.loadIfc(fileToLoad)
    }
  }

  private initializeScene() {
    // based on: https://docs.thatopen.com/Tutorials/SimpleScene
    this.components.scene = new SimpleScene(this.components);
    this.components.renderer = new SimpleRenderer(this.components, this.container.nativeElement);
    this.components.camera = new SimpleCamera(this.components);
    this.components.raycaster = new SimpleRaycaster(this.components);
    this.components.init();
    (this.components.scene as any).setup(); // note: typecast is necessary..
  }

  private async initializeFragmentIfcLoader() {
    // based on: https://docs.thatopen.com/Tutorials/FragmentIfcLoader
    this.fragmentIfcLoader = new FragmentIfcLoader(this.components);

    this.fragmentIfcLoader.settings.wasm = {
      path: "https://unpkg.com/web-ifc@0.0.46/",
      absolute: true
    }
    this.fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    this.fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

  }

  private async loadIfc(fileName: string) {
    // based on: https://docs.thatopen.com/Tutorials/FragmentIfcLoader
    if (!this.fragmentIfcLoader) {
      throw new Error('IfcLoader not initialized...')
    }
    console.log(`=> Loading ${fileName}`)
    const ifcFile = await fetch(`assets/${fileName}`);
    const data = await ifcFile.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await this.fragmentIfcLoader.load(buffer, fileName);
    this.components.scene.get().add(model);
    console.log(`=> Done loading ${fileName}`);
  }
}

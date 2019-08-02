import * as React from 'react';
//import styles from '/Licence.module.scss';
import styles from '../SpUser.module.scss';
import { LicenceAppInfoProps } from '../ISpUserProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { update, get } from '@microsoft/sp-lodash-subset';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

export interface ILicenceKeyInfoState {
  LicenceKey?:any;
  isTrailChecked:boolean;
 }

export  class LicenseKeyFormComponent extends React.Component<LicenceAppInfoProps, ILicenceKeyInfoState> {
  licenceManager:any = require('../LicenseComponents/LicenseManager.js');
  constructor(props?: LicenceAppInfoProps, state?: ILicenceKeyInfoState) {
    super(props);
    this.state = {
      isTrailChecked:false
    }
    
    this.onconfigurationsUpdate = this.onconfigurationsUpdate.bind(this);
    this.activateLicence = this.activateLicence.bind(this);
    this.onIsTrailChecked = this.onIsTrailChecked.bind(this);
  }
  onconfigurationsUpdate()
  {
    this.props.onConfigurationsUpdate("LicenceKey",this.state.LicenceKey);
  }
  onLicenceKeyChange(value:any)
  {
    this.setState({
      LicenceKey:value
    })
  }
  onIsTrailChecked()
  {
    this.setState({
      isTrailChecked:!this.state.isTrailChecked
    })
  }
  activateLicence()
  {
    this.licenceManager.licenseUtility.activateLicense(this.state.LicenceKey,this.state.isTrailChecked,'activate')
    //licenseManaager.activateLicense(licenseManaager.inputLicenseKey.val(), false, 'activate');
  }
  public render(): React.ReactElement<LicenceAppInfoProps> {
  
    return (
        <div className={styles.LicenceAppInfoComponent }>
      <div className={"ms-Grid"}>
      <div className={"ms-Grid-row"}>
      <a className={styles.applicationName +" "+styles.anchorElements}>Saketa Employee Directory</a>
      </div>
  <div className={"ms-Grid-row" +" "+styles.licenceInfo}>
     <div className={"ms-u-sm12 "+" "+ styles.licenceInfoDiv}>
     <div className={"ms-textAlignCenter" +" "+styles.saketaImageInfoDiv}>
          <img className={styles.saketaLogo} src="https://www.featuredcustomers.com/media/Company.logo/Saketa.png" />
     </div>
     <div className={"ms-Grid-col" +" "+" "+"ms-textAlignCenter" +" "+styles.licenceAppInfoDiv}>
     <span className={styles.licenceKeyFormFields}>Enter License Key</span>
     <TextField className={styles.employeeFormTextFields}  onChanged={(value) => this.onLicenceKeyChange(value)}  required  />
     <Checkbox label="Is trail?"   className={styles.licenceKeyCheckBox} onChange={()=>this.onIsTrailChecked()} />
     <DefaultButton
            data-automation-id="test"
            text="Submit"
            className={styles.licenseEmployeeFormButton}
            onClick={this.activateLicence}
          />
     </div>
     <div className={"ms-Grid-row"}>
       
    </div>
    </div>
    
  </div>
 </div>
      </div>
    )
  }
}

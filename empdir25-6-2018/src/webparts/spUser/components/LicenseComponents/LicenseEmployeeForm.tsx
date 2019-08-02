import * as React from 'react';
//import styles from '/Licence.module.scss';
import styles from '../SpUser.module.scss';
import { LicenceAppInfoProps } from '../ISpUserProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { update, get } from '@microsoft/sp-lodash-subset';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import {LicenseKeyFormComponent} from '../LicenseComponents/LicenseKeyForm';
import {BuyaLicence} from '../LicenseComponents/BuyaLicenceComponent';
//var licenceManager:any = require('../LicenseComponents/LicenseManager.js');

export interface ILicenceAppInfoState {
  trailType:string,
  employee?:any
 }

export  class FreeTrailEmployeeDetailsComponent extends React.Component<LicenceAppInfoProps, ILicenceAppInfoState> {
  licenceManager:any = require('../LicenseComponents/LicenseManager.js');
  constructor(props?: LicenceAppInfoProps, state?: ILicenceAppInfoState) {
    super(props);
    this.state={
      trailType:"EmpForm"

    }
    this.setemployeeFormFields = this.setemployeeFormFields.bind(this);
    this.onEmployeeDetailsSubmit= this.onEmployeeDetailsSubmit.bind(this);
    this.onconfigurationsUpdate = this.onconfigurationsUpdate.bind(this);
  }
  onLicenceButtonClick(value:string)
  {
   this.setState({
     trailType:value
   })
  }
  private setemployeeFormFields(value: any, propertyName: string) {
    
    this.setState({
        employee: { ...this.state.employee, [propertyName]: value }
    })
}
onconfigurationsUpdate()
{
  this.props.onConfigurationsUpdate("LicenceKey",this.licenceManager.licenseUtility.trialKey);
}
public onEmployeeDetailsSubmit()
{
  var licenseSettings = {
    success: () => {
      this.onconfigurationsUpdate();
    },
}
  this.licenceManager.licenseUtility.submitUserInfo(this.state.employee,licenseSettings)
}
  public render(): React.ReactElement<LicenceAppInfoProps> {
  
    return (
        <div className={styles.LicenceAppInfoComponent }>
        {
          this.state.trailType=="EmpForm"?
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
     <span className={styles.formUserInfo}>Please fill in the information below to get your trial</span>
     <TextField className={styles.employeeFormTextFields} placeholder="Oraganization Name" required onChanged={(value) => this.setemployeeFormFields(value, "OrgName")} />
     <TextField className={styles.employeeFormTextFields} placeholder="Contact Name" required onChanged={(value) => this.setemployeeFormFields(value, "ContactName")}/>
     <TextField className={styles.employeeFormTextFields} placeholder="Email" required onChanged={(value) => this.setemployeeFormFields(value, "Email")}/>
     <TextField className={styles.employeeFormTextFields} placeholder="Phone" required onChanged={(value) => this.setemployeeFormFields(value, "ContactNumber")}/>
     <TextField  className={styles.employeeFormTextFields} placeholder="Tell us more..." multiline rows={4} onChanged={(value) => this.setemployeeFormFields(value, "more")}/>
     <DefaultButton
            data-automation-id="test"
            text="Submit"
            className={styles.licenseEmployeeFormButton}
            onClick={this.onEmployeeDetailsSubmit}
          />
     </div>
     <div className={"ms-Grid-row"}>
       <a  className={styles.floatLeft +" "+ styles.anchorElements} onClick={()=>this.onLicenceButtonClick("BuyaLicence")}>Buy a license ?</a>
       <a  className={styles.anchorElements +" "+styles.floatRight} onClick={()=>this.onLicenceButtonClick("HaveLicence")}>Already Have a license ?</a>
    </div>
    </div>
    
  </div>
 </div>:this.state.trailType=="BuyaLicence"?<BuyaLicence onConfigurationsUpdate={this.props.onConfigurationsUpdate}/>:this.state.trailType=="HaveLicence"?<LicenseKeyFormComponent onConfigurationsUpdate={this.props.onConfigurationsUpdate}/>:""
        }
      </div>
    )
  }
}

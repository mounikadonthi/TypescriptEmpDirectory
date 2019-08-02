import * as React from 'react';
//import styles from '/Licence.module.scss';
import styles from '../SpUser.module.scss';
import { LicenceAppInfoProps } from '../ISpUserProps';

import {FreeTrailEmployeeDetailsComponent} from '../LicenseComponents/LicenseEmployeeForm';
import {LicenseKeyFormComponent} from '../LicenseComponents/LicenseKeyForm';
import {BuyaLicence} from '../LicenseComponents/BuyaLicenceComponent'

import { escape } from '@microsoft/sp-lodash-subset';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { update, get } from '@microsoft/sp-lodash-subset';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

export interface ILicenceAppInfoState {
  trailType:string;
 }
export  class LicenceAppInfoComponent extends React.Component<LicenceAppInfoProps, ILicenceAppInfoState> {
  licenceManager:any = require('../LicenseComponents/LicenseManager.js');
  constructor(props?: LicenceAppInfoProps, state?: ILicenceAppInfoState) {
    super(props);
    this.state={
      trailType:"AppInfo"

    }
    this.onLicenceButtonClick = this.onLicenceButtonClick.bind(this);
  }
  public componentDidMount(): void {
   // this.licenceManager.licenseUtility.submitUserInfo(this.state.employee,licenseSettings)
    
   }
  onLicenceButtonClick(value:string)
  {
   this.setState({
     trailType:value
   })
  }
  
  public render(): React.ReactElement<LicenceAppInfoProps> {
  
    return (
      
        <div className={"ms-Grid" +" "+styles.LicenceAppInfoComponent}>
        { this.state.trailType =="AppInfo"?
          <div>
        <div className={"ms-Grid-row"}>
        <a className={styles.applicationName +" "+styles.anchorElements } href="">Saketa Employee Directory</a>
        </div>
    <div className={"ms-Grid-row" +" "+styles.licenceInfo}>
       <div className={"ms-u-sm9 "+" "+ styles.licenceInfoDiv}>
       <div className={"ms-textAlignCenter" +" "+styles.saketaImageInfoDiv}>
            <img className={styles.saketaLogo} src="https://www.featuredcustomers.com/media/Company.logo/Saketa.png" />
       </div>
       <div className={"ms-Grid-col" +" "+styles.licenceAppInfoDiv}>
       <p className={styles.appLicenceInfo}>Employee Offboarding is an application that improves an organization’s operational efficiency by creating a reliable and centralized platform to process all termination related information, including the reasons for separation, dates of employment and any other data pertaining to the terminated employee.</p>
       <p className={styles.appLicenceInfo}>The intuitive interface and customizable workflow means that you can set up the offboarding process as per your organization’s policies, and the automated process ensures that errors are eliminated and costs are drastically reduced. The application also has a central dashboard that will allow the Human Resources manager to take a look at the status of the Offboarding for a particular employee, and follow up with the concerned department if any delays are noted.</p>
       <p className={styles.appLicenceInfo}>Explore Saketa Employee Offboarding now with a free trial or request us for a demo <a className={styles.anchorElements} href="mailto:demo@saketa.com">demo@saketa.com.</a></p>
       <p className={styles.appLicenceInfo}>Like it already, let us know your requirements and our team <a className={styles.anchorElements} href="mailto:feedback@saketa.com ">feedback@saketa.com</a></p>
       <DefaultButton
              text="Have a licence"
              className={styles.floatLeft +" "+styles.haveLiceneceButton}
              onClick={()=>this.onLicenceButtonClick("LicenceKeyInfoForm")}
            />
       <DefaultButton
           text="Intiate a trail"
           className={styles.floatRight +" "+styles.intiateTrailButton}
           onClick={()=>this.onLicenceButtonClick("EmployeeInfo")}
            />
           
       </div>
       <div className={"ms-Grid-row"}>
         <a className={styles.applicationName +" "+styles.anchorElements} href="" onClick={()=>this.onLicenceButtonClick("BuyaLicence")}>Buy a license ?</a>
      </div>
      </div>
    </div>
    </div>:this.state.trailType=="LicenceKeyInfoForm"?<LicenseKeyFormComponent onConfigurationsUpdate={this.props.onConfigurationsUpdate}/>:this.state.trailType=="EmployeeInfo"?<FreeTrailEmployeeDetailsComponent onConfigurationsUpdate={this.props.onConfigurationsUpdate}/>:this.state.trailType=="BuyaLicence"?<BuyaLicence onConfigurationsUpdate={this.props.onConfigurationsUpdate}/>:""
        }
   </div>
    )
  }
}

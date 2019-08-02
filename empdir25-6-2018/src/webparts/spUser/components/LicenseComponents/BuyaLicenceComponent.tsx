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


export  class BuyaLicence extends React.Component<LicenceAppInfoProps, {}> {


  

  public render(): React.ReactElement<LicenceAppInfoProps> {
  
    return (
        <div className={ styles.LicenceAppInfoComponent }>
      <div className={"ms-Grid"}>
      <div className={"ms-Grid-row"}>
      <a className={styles.applicationName +" "+styles.anchorElements}>Saketa Employee Directory</a>
      </div>
  <div className={"ms-Grid-row" +" "+styles.licenceInfo}>
     <div className={"ms-u-sm12 "+" "+ styles.licenceInfoDiv}>
     <div className={"ms-textAlignCenter" +" "+styles.saketaImageInfoDiv}>
          <img className={styles.saketaLogo} src="https://www.featuredcustomers.com/media/Company.logo/Saketa.png" />
     </div>
     <div className={"ms-u-sm12" +" "+" "+"ms-textAlignCenter" +" "+styles.licenceAppInfoDiv}>
     <span className={styles.formBlockMsg}>Thank You for your interest!</span>
     <span className={styles.formMsg}>Please provide a short note and our team will contact you.</span>
     <TextField className={styles.employeeFormTextFields} placeholder="Note..." multiline rows={4}  />
     <DefaultButton
            data-automation-id="test"
            text="Submit"
            className={styles.licenseEmployeeFormButton}
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

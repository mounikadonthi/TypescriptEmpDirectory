import * as React from 'react';


import { initializeIcons } from '@uifabric/icons';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton,PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox, ICheckboxProps  } from 'office-ui-fabric-react/lib/Checkbox';

import { DirectoryService } from '../Services/DirectoryService';
import { PersonaModel } from '../Interfaces/SPUserPersonaModel';
import { SPUserService } from "../Services/SPUserService";
import { SPUser,ThemeProperties } from './spuser';

import { IGeneralConfigurationComponentSProps } from './ISpUserProps';

import styles from './SpUser.module.scss';

export interface IGeneralConfigurationComponentState {
    DefaultTheme:string;
    colorPickerFor:string;
    color:string;
    loggedUserPersona?:PersonaModel
      AlphabetBackgroundColor:string,
      AlphabetTextColor:string,
      HideAlphabets:boolean;
}

export  class GeneralConfigurationComponent extends React.Component<IGeneralConfigurationComponentSProps, IGeneralConfigurationComponentState> {

  constructor(props?: IGeneralConfigurationComponentSProps, state?: IGeneralConfigurationComponentState) {
    super(props);
    this.state = {
        DefaultTheme:"Default",
        colorPickerFor:"",
        color:"#FFFFFF",
        AlphabetBackgroundColor:this.props.UserProps.AlphabetBackgroundColor!=undefined?this.props.UserProps.AlphabetBackgroundColor:"#FFFFFF",
        AlphabetTextColor:this.props.UserProps.AlphabetTextColor!=undefined?this.props.UserProps.AlphabetTextColor:"#000000",
        HideAlphabets:this.props.UserProps.ShowAlphabets!=undefined?JSON.parse(this.props.UserProps.ShowAlphabets):false
      };
      this.AlphabetBackgroundColor = this.AlphabetBackgroundColor.bind(this);
      this.AlphabetTextColor = this.AlphabetTextColor.bind(this);
      this.saveDynamicCSSProperties = this.saveDynamicCSSProperties.bind(this);
      this.updateDynamicCSSToList= this.updateDynamicCSSToList.bind(this);
      this.addDynamicCSSToList = this.addDynamicCSSToList.bind(this);
      this.onHideAlphabets = this.onHideAlphabets.bind(this);
  }
  
  public componentDidMount(): void {
   
   }


   onHideAlphabets()
   {
       this.setState({
         HideAlphabets:!this.state.HideAlphabets
       })
   }

  saveDynamicPersonaProperties()
  {
    ()=> this.props.onClosePanel();
  }
  
  

  OpenColorPicker(colorPickerFor:string)
  {
      this.setState({
        colorPickerFor:colorPickerFor,
      })
  }
 

  AlphabetBackgroundColor(color: string) 
  {
    this.setState({
        AlphabetBackgroundColor:color
    })
  }
  AlphabetTextColor(color: string) 
  {
    this.setState({
        AlphabetTextColor:color
    })
  }

  onconfigurationsUpdate(property:string,propertypath:any)
  {
    this.props.onConfigurationsUpdate(property,propertypath);
      this.props.onClosePanel();
  }

  addDynamicCSSToList()
  {
    var spUserService = new SPUserService(this.props.context);
    var exisitingProp = this.props.UserProps;
    var exisitingProp = this.props.UserProps;
    exisitingProp.AlphabetTextColor=this.state.AlphabetTextColor;
    exisitingProp.AlphabetBackgroundColor=this.state.AlphabetBackgroundColor;
    exisitingProp.ShowAlphabets=this.state.HideAlphabets;
    this.onconfigurationsUpdate("UserProps",exisitingProp)
  }

 

  updateDynamicCSSToList()
  {
    var spUserService = new SPUserService(this.props.context);
    var exisitingProp = this.props.UserProps;
    var exisitingProp = this.props.UserProps;
    exisitingProp.AlphabetTextColor=this.state.AlphabetTextColor;
    exisitingProp.AlphabetBackgroundColor=this.state.AlphabetBackgroundColor;
    exisitingProp.ShowAlphabets=this.state.HideAlphabets;
    this.onconfigurationsUpdate("UserProps",exisitingProp)
  }

  saveDynamicCSSProperties()
  {

    this.props.UserProps ?this.updateDynamicCSSToList():this.addDynamicCSSToList();// :this.onClosePanel();
    
  }


  public render(): React.ReactElement<IGeneralConfigurationComponentSProps> {
    console.log(this.state.AlphabetBackgroundColor)
    return (
        <div className={styles.NavigationElementsDiv+" "+"ms-Grid"}>
          <div className={"ms-Grid-row" }>
        <div className={styles.configurations+" "+" ms-Grid-col ms-u-sm4 "}>
        <div>
        <h2>General Configurations</h2>
     
        </div>
        { 
            <div>
              <TextField  label="Alphabet Background Color" value={this.state.AlphabetBackgroundColor} onFocus={()=>this.OpenColorPicker("alphabetBgColor")} onBlur={()=>this.OpenColorPicker(" ")}/>
              {
                  this.state.colorPickerFor=="alphabetBgColor" && <ColorPicker color={this.state.AlphabetBackgroundColor}   onColorChanged={this.AlphabetBackgroundColor} />
              }
               <TextField  label="Alphabet Text Color" value={this.state.AlphabetTextColor} onFocus={()=>this.OpenColorPicker("alphabetTextColor")} onBlur={()=>this.OpenColorPicker(" ")}/>
              {
                  this.state.colorPickerFor=="alphabetTextColor" && <ColorPicker color={this.state.AlphabetTextColor}   onColorChanged={this.AlphabetTextColor} />
              }
              
         </div>
        }
        <div>
      
        <Checkbox  label ="Show Alphabets" className={styles.configurationCheckBoxes}   defaultChecked={this.state.HideAlphabets} onChange={()=>this.onHideAlphabets()}  />
        
        </div>
        </div>
        
        <div className={styles.configurationsCloseButton+" "+" ms-Grid-col ms-u-sm8"}  > 
        <h3><Icon onClick={()=>this.props.onClosePanel()} iconName="ChromeClose" className={styles.userPropertiesDelete +" " +styles.pointerCursor} /></h3>
        </div> 
          </div>
          <div className={styles.footerButtons}>
                <PrimaryButton  onClick={this.saveDynamicCSSProperties} className={styles.footerButton} > Save </PrimaryButton>
          </div>
      </div>
    );
  }


}

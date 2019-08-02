import * as React from 'react';


import { initializeIcons } from '@uifabric/icons';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton,PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IPersonaProps, Persona, PersonaSize, PersonaPresence } from "office-ui-fabric-react/lib/Persona";
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox, ICheckboxProps  } from 'office-ui-fabric-react/lib/Checkbox';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';
import { Label } from 'office-ui-fabric-react/lib/Label';

import {TileCardComponent} from './CardComponent';
import {CardComponent} from './TileCardComponent'

import { DirectoryService } from '../Services/DirectoryService';
import { SPUserService } from "../Services/SPUserService";
import { SPUser } from './spuser';

import { PersonaModel } from '../Interfaces/SPUserPersonaModel';
import { INodeConfigurationComponentSProps } from './ISpUserProps';

import styles from './SpUser.module.scss';

export interface INodeConfigurationComponentState {
    showPanel: boolean;
    selectedUserProperty:string;
    selectedUserProperties:string[];
    DynamicUserProperties:string[];
    UserProps:any;
    loggedUser:any;
    loggedUserPersona:PersonaModel;
    selectedViewType:string;
    colorPickerValueForText:string,
    NodeBackgroundColor:string,
    colorPickerFor:string;
    DefaultTheme:string;
    IsRoundedCornersEnabled:boolean;
    IsRoundedImage:boolean;

}

export  class NodeConfigurationComponent extends React.Component<INodeConfigurationComponentSProps, INodeConfigurationComponentState> {

  constructor(props?: INodeConfigurationComponentSProps, state?: INodeConfigurationComponentState) {
    super(props);
    this.state = {
        loggedUserPersona:undefined,
        loggedUser:this.props.loggedUser,
        showPanel: true,
        selectedUserProperty:"",
        selectedUserProperties:[],
        DynamicUserProperties:this.props.DynamicUserProperties,
        UserProps:[],
        colorPickerFor:"",
        DefaultTheme:"Default",
        selectedViewType:this.props.UserProps.ViewType!=undefined?this.props.UserProps.ViewType:"",
        colorPickerValueForText:this.props.UserProps.NodeTextColor!=undefined?this.props.UserProps.NodeTextColor:"#FFFFFF",
        NodeBackgroundColor:this.props.UserProps.NodeBackgroundColor!=undefined?this.props.UserProps.NodeBackgroundColor:"#e9e8e8",
        IsRoundedCornersEnabled:this.props.UserProps.ShowRoundedCorners!=undefined?JSON.parse(this.props.UserProps.ShowRoundedCorners):false,
        IsRoundedImage:this.props.UserProps.ShowRoundedImage!=undefined?JSON.parse(this.props.UserProps.ShowRoundedImage):false,
        
        
      };
      this.colorPickerValueForText = this.colorPickerValueForText.bind(this);
      this.NodeBackgroundColor = this.NodeBackgroundColor.bind(this);
      this.addDynamicPersonaProperties = this.addDynamicPersonaProperties.bind(this);
      this.onItemsSelected = this.onItemsSelected.bind(this);
      this.deleteUserProperty = this.deleteUserProperty.bind(this);
      this.saveDynamicPersonaProperties = this.saveDynamicPersonaProperties.bind(this);
      this.onChangeViewType = this.onChangeViewType.bind(this);
      this.OpenColorPicker = this.OpenColorPicker.bind(this);
      this.onChangeThemeType = this.onChangeThemeType.bind(this);
      this.onRoundedCorner = this.onRoundedCorner.bind(this);
      this.GeneratePersonaModel = this.GeneratePersonaModel.bind(this);
      this.onRoundedImageSelected = this.onRoundedImageSelected.bind(this);
  }
  
  public componentDidMount(): void {
    this.GeneratePersonaModel();
    
   }

   addDynamicPersonaProperties=(ViewType: string = '')=>{
    
    this.state.selectedUserProperty!=""&& this.state.DynamicUserProperties.push(this.state.selectedUserProperty)
    var exisitingProp;
    
    this.props.UserProps?  exisitingProp = this.props.UserProps:undefined;
   if(this.props.UserProps && (ViewType=="Card"))
   {
   var UserPropertiesForTile =[];
   exisitingProp.secondaryText!="undefined"?UserPropertiesForTile.push(exisitingProp.secondaryText):"";
   exisitingProp.tertiaryText!="undefined"?UserPropertiesForTile.push(exisitingProp.tertiaryText):"";
   exisitingProp.quaternaryText!="undefined"?UserPropertiesForTile.push(exisitingProp.quaternaryText):"";
   exisitingProp.quinaryText!="undefined"?UserPropertiesForTile.push(exisitingProp.quinaryText):"";
    this.setState({
      DynamicUserProperties:UserPropertiesForTile,
      
    }, () => {this.GeneratePersonaModel()})
   }
   else if(this.props.UserProps && (ViewType=="Tile")){
    var UserPropertiesForCard =[];
    exisitingProp.secondaryTextForCard!="undefined"?UserPropertiesForCard.push(exisitingProp.secondaryTextForCard):"";
    exisitingProp.teritaryTextForCard!="undefined"?UserPropertiesForCard.push(exisitingProp.teritaryTextForCard):"";
    this.setState({
      DynamicUserProperties:UserPropertiesForCard
    }, () => {this.GeneratePersonaModel()})
   }
   this.GeneratePersonaModel()
   
  }
   GeneratePersonaModel()
  {
    var usersPerson: PersonaModel ;
      var personaTemp: PersonaModel = {
        Id: Math.floor(Math.random() * 100) + 1  ,
        Name: this.state.loggedUser.DisplayName,
         secondaryText: ((this.state.loggedUser[ this.state.DynamicUserProperties[0]]?this.state.loggedUser[ this.state.DynamicUserProperties[0]]:
                        (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                          prop.Key ==  this.state.DynamicUserProperties[0] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[0]
                          )
                        ).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                          prop.Key ==  this.state.DynamicUserProperties[0] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[0]
                          )[0].Value):"")),
         tertiaryText:((this.state.loggedUser[ this.state.DynamicUserProperties[1]]?this.state.loggedUser[ this.state.DynamicUserProperties[1]]:
                          (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                            prop.Key ==  this.state.DynamicUserProperties[1] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[1]
                          )).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                             prop.Key ==  this.state.DynamicUserProperties[1] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[1]
                             )[0].Value):"")),
        quaternaryText:((this.state.loggedUser[ this.state.DynamicUserProperties[2]]?this.state.loggedUser[this.state.DynamicUserProperties[2]]:
                              (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                prop.Key ==  this.state.DynamicUserProperties[2] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[2]
                              )).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                 prop.Key ==  this.state.DynamicUserProperties[2] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[2]
                                 )[0].Value):"")),    
        quinaryText:((this.state.loggedUser[ this.state.DynamicUserProperties[3]]?this.state.loggedUser[ this.state.DynamicUserProperties[3]]:
                            (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                    prop.Key ==  this.state.DynamicUserProperties[3] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[3]
                                  )).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                     prop.Key ==  this.state.DynamicUserProperties[3] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[3]
                                     )[0].Value):"")),                
                             
      };
      this.setState({
        loggedUserPersona:personaTemp,
        DefaultTheme:this.props.UserProps?this.props.UserProps.ThemeType:"Default",
 
      })
  }
   
  deleteUserProperty(property:string)
  {

    var DynamicUserProperties = this.state.DynamicUserProperties.filter((prop)=>prop!=property)
    this.setState(
      {
        DynamicUserProperties:DynamicUserProperties,


      }
    )
 }

  private onItemsSelected = (userProperty : IDropdownOption) => {
    if(this.state.selectedUserProperty!=userProperty.text){
    this.setState({
      selectedUserProperty: userProperty.text
    });
  }
  else{
    this.setState({
      selectedUserProperty: ""
    });
  }
  }

  addDynamicPersonaPropertiesToList(data:string[])
  {
    var spUserService = new SPUserService(this.props.context);
     spUserService.setCardProperties(data,this.state.selectedViewType,this.state.DefaultTheme,this.state.colorPickerValueForText,this.state.NodeBackgroundColor,this.state.IsRoundedCornersEnabled,this.state.IsRoundedImage).then((data:any)=>{
        this.props.getUserPropertiesData();
        this.props.onClosePanel();
       } );
  }

    colorPickerValueForText(color: string) 
    {
      this.setState({
         colorPickerValueForText:color
      })
    }
    public onChangeThemeType = (item: IDropdownOption): void => {
      
         this.setState({
             DefaultTheme: item.text,
         });

        
   };
   onRoundedCorner()
   {
       this.setState({
         IsRoundedCornersEnabled:!this.state.IsRoundedCornersEnabled
       })
   }
    NodeBackgroundColor(color: string) 
    {
      this.setState({
          NodeBackgroundColor:color
      })
    }
    OpenColorPicker(colorPickerFor:string)
    {
        this.setState({
          colorPickerFor:colorPickerFor,
        })
    }

    onRoundedImageSelected()
    {
        this.setState({
          IsRoundedImage:!this.state.IsRoundedImage
        })
    }

    onconfigurationsUpdate(property:string,propertypath:any)
    {
      this.props.onConfigurationsUpdate(property,propertypath);
     // this.props.getUserPropertiesData();
      this.props.onClosePanel();
    }

  updateDynamicPersonaPropertiesToList(data:string[])
  {
    var spUserService = new SPUserService(this.props.context);
    var exisitingProp = this.props.UserProps;
      if(this.state.selectedViewType=="Tile")
      {
        exisitingProp.secondaryTextForCard=data[0];
        exisitingProp.teritaryTextForCard=data[1];
        exisitingProp.ShowRoundedImage=this.state.IsRoundedImage;
        exisitingProp.ThemeType = this.state.DefaultTheme;
        exisitingProp.NodeTextColor = this.state.colorPickerValueForText;
        exisitingProp.ShowRoundedCorners= this.state.IsRoundedCornersEnabled;
        exisitingProp.NodeBackgroundColor = this.state.NodeBackgroundColor;
        exisitingProp.ViewType = this.state.selectedViewType;
        this.onconfigurationsUpdate("UserProps",exisitingProp)
      }
      else{
        exisitingProp.secondaryText=data[0];
        exisitingProp.tertiaryText=data[1];
        exisitingProp.ShowRoundedImage=this.state.IsRoundedImage;
        exisitingProp.quaternaryText=data[2];
        exisitingProp.quinaryText=data[3];
        exisitingProp.ThemeType = this.state.DefaultTheme;
        exisitingProp.NodeTextColor = this.state.colorPickerValueForText;
        exisitingProp.ShowRoundedCorners= this.state.IsRoundedCornersEnabled;
        exisitingProp.NodeBackgroundColor = this.state.NodeBackgroundColor;
        exisitingProp.ViewType = this.state.selectedViewType;
        this.onconfigurationsUpdate("UserProps",exisitingProp)
      }
  }

  saveDynamicPersonaProperties()
  {
      
    this.state.DynamicUserProperties.length!=0&&
    this.setState({

      DynamicUserProperties:this.state.DynamicUserProperties
    })
  
    this.props.UserProps?this.updateDynamicPersonaPropertiesToList(this.state.DynamicUserProperties):this.addDynamicPersonaPropertiesToList(this.state.DynamicUserProperties);// :this.onClosePanel();
    
  }

   public onChangeViewType = (item: IDropdownOption): void => {

    var selectedUserPropertiesForViewTypes=item.text=="Tile"?this.state.DynamicUserProperties.slice(0,2).map((prop) => {return prop}):this.state.DynamicUserProperties
    this.setState({
      selectedViewType: item.text,
     DynamicUserProperties:[]
    });
    this.addDynamicPersonaProperties(item.text);
  };

  public render(): React.ReactElement<INodeConfigurationComponentSProps> {
    const userPropertiesDropdown = <div><Dropdown
    placeHolder='--select--'
     selectedKey={( undefined)}
     id='departmentDropdown'
     label="Node fields"
     ariaLabel='Department Dropdown'
     onChanged={this.onItemsSelected}
     options={
      DirectoryService.Properties
     }
    
   /><DefaultButton
           data-automation-id="test"
           text="Click to add Property"
           onClick={()=>this.addDynamicPersonaProperties()}
           className={styles.addPropertiesButton}
           disabled={this.state.selectedViewType=="Card"?this.state.selectedUserProperty=="" || this.state.DynamicUserProperties.length==4:this.state.selectedUserProperty=="" || this.state.DynamicUserProperties.length==2}
         />
        
         </div>;
    return (
        <div className={styles.NavigationElementsDiv+" "+"ms-Grid"} >
          <div className={"ms-Grid-row" }>
        <div className={styles.configurations+" "+" ms-Grid-col ms-u-sm3"}  > 
        {
           
         <div>
           <h3>Node Configurations</h3>
        <Dropdown
          placeHolder="--Select ViewType--"
          label="Node View"
          selectedKey={this.state.selectedViewType}
          onChanged={this.onChangeViewType}
          options={[
            { key: 'Card', text: 'Card' },
            { key: 'Tile', text: 'Tile' },
          ]}
          
        />
      {userPropertiesDropdown}
      <Checkbox
          className={styles.configurationCheckBoxes}
          label ="Show RoundedCorners"
          defaultChecked={this.state.IsRoundedCornersEnabled}
          onChange={()=>this.onRoundedCorner()}
        />
        <Checkbox  label ="Show RoundedImage" className={styles.configurationCheckBoxes}   defaultChecked={this.state.IsRoundedImage} onChange={()=>this.onRoundedImageSelected()}  />
      <Dropdown
          placeHolder="--Select Theme--"
          label="Theme"
          selectedKey={this.state.DefaultTheme}
          onChanged={this.onChangeThemeType}
          options={[
            { key: 'Default', text: 'Default' },
            { key: 'Custom', text: 'Custom' },
          ]}
          
        />
        { this.state.DefaultTheme=="Custom" &&
          <div>
                <TextField  label="Node Text Color" value={this.state.colorPickerValueForText} onFocus={()=>this.OpenColorPicker("TextColor")} onBlur={()=>this.OpenColorPicker(" ")}/>
                {
                    this.state.colorPickerFor=="TextColor" && <ColorPicker color={this.state.colorPickerValueForText}   onColorChanged={this.colorPickerValueForText} />
                }
                <TextField  label="Node Background Color" value={this.state.NodeBackgroundColor} onFocus={()=>this.OpenColorPicker("nodeBgColor")} onBlur={()=>this.OpenColorPicker(" ")}/>
                {
                    this.state.colorPickerFor=="nodeBgColor" && <ColorPicker color={this.state.NodeBackgroundColor}   onColorChanged={this.NodeBackgroundColor} />
                }
          </div>
        }
    
       </div>
        }
        </div>
        <div className={" ms-Grid-col ms-u-sm8"}  > 
        <div>
        <h3>Node Configurations Preview</h3>
       
        </div>
        <div className={styles.PersonaProperties}>
      <div className={styles.personaPropertiesWithICons}>
      <div><span>Fields Showing:</span></div>
      
      {
          this.state.DynamicUserProperties.length!=0 &&  this.state.DynamicUserProperties.map((prop)=>{return <div><span>{prop}</span> <Icon onClick={()=>this.deleteUserProperty(prop)} iconName="ChromeClose" className={styles.userPropertiesDelete +" " +styles.pointerCursor} /></div>})
       
      }
     </div>
     {
        this.state.loggedUserPersona &&
     <div className={styles.LoggedUserPersona}>
      {
        
         
        this.state.selectedViewType=="Tile" ?
        
       <div  className={this.state.IsRoundedCornersEnabled==true?styles.employeecard+" "+styles.roundedCorner +" "+styles.LoggedUserPersona :styles.employeecard+" "+styles.LoggedUserPersona} style={ this.state.DefaultTheme=="Custom"?{backgroundColor: this.state.NodeBackgroundColor,color:this.state.colorPickerValueForText}:{backgroundColor:"#e9e8e8",color:"black"}}>
       <img className={styles.employeeCardimage} src="https://www.relayinvestments.com/wp-content/uploads/2017/05/testi-pic-generic.jpg" alt="User" width="42" height="42" style={this.state.IsRoundedImage==true?{'borderRadius': '34px'}:{'borderRadius': '0px'}}/>
          <span className={styles.employeecardSpan}>{this.state.loggedUserPersona.Name}</span>
          <span className={styles.employeecardSpan}>{this.state.loggedUserPersona.secondaryText}</span>
          <span className={styles.employeecardSpan}>{this.state.loggedUserPersona.tertiaryText}</span>
      <div className={styles.employeecardicons}>
                              <i className="ms-Icon ms-Icon--AddPhone" aria-hidden="true"></i> <span className={styles.employeeiconsafter}>| </span>
                              <i className="ms-Icon ms-Icon--MailSolid" aria-hidden="true"></i><span className={styles.employeeiconsafter}>| </span>
                              <i className="ms-Icon ms-Icon--MessageFill" aria-hidden="true"></i>
                        </div>
      </div>:
      <div className={this.state.IsRoundedCornersEnabled==true?styles.employeeNodeTilecard+" "+styles.roundedCorner+" "+styles.LoggedUserPersona:styles.employeeNodeTilecard+" "+styles.LoggedUserPersona}  style={this.state.DefaultTheme=="Custom"?{backgroundColor:this.state.NodeBackgroundColor,color:this.state.colorPickerValueForText}:{backgroundColor:"#e9e8e8",color:"black"}}>
      <img className={styles.employeeTileCardimage} src="https://www.relayinvestments.com/wp-content/uploads/2017/05/testi-pic-generic.jpg" alt="User" width="42" height="42" style={this.state.IsRoundedImage==true?{'borderRadius': '34px'}:{'borderRadius': '0px'}}/>
      <span className={styles.employeeTilecardSpan}>{this.state.loggedUserPersona.Name}</span>
      <span className={styles.employeeTilecardSpan}>{this.state.loggedUserPersona.secondaryText}</span>
          <span className={styles.employeeTilecardSpan}>{this.state.loggedUserPersona.tertiaryText}</span>
          <span className={styles.employeeTilecardSpan}>{this.state.loggedUserPersona.quaternaryText}</span>
            <span className={styles.employeeTilecardSpan+" "+ styles.employeecardQuinaryText}>{this.state.loggedUserPersona.quinaryText}</span>
   
      <div className={styles.employeeTileCardicons} >
                              <i className="ms-Icon ms-Icon--AddPhone" aria-hidden="true"></i> <span className={styles.employeeiconsafter}>| </span>
                              <i className="ms-Icon ms-Icon--MailSolid" aria-hidden="true"></i><span className={styles.employeeiconsafter}>| </span>
                              <i className="ms-Icon ms-Icon--MessageFill" aria-hidden="true"></i>
      </div>
   </div>
      }
       
      </div>
    
      
    }
      </div>
      <div className={styles.nodeConfigurationsNote}>
      <Label className={styles.nodeConfigurationsNoteMessage}>Note</Label>{
       this.state.selectedViewType=="Tile"?<Label>: Max 2elements will be selected </Label>:<Label>: Max 4elements will be selected </Label>
      }
      
      </div>
        </div>
        <div className={styles.configurationsCloseButton+" "+" ms-Grid-col ms-u-sm1"}  > 
        <h3><Icon onClick={()=>this.props.onClosePanel()} iconName="ChromeClose" className={styles.userPropertiesDelete +" " +styles.pointerCursor} /></h3>
        </div> 
        <div className={styles.footerButtons}>
        <PrimaryButton  onClick={this.saveDynamicPersonaProperties} className={styles.footerButton} >
          Save
        </PrimaryButton>
      </div>
      </div>
      </div>
    );
  }


}

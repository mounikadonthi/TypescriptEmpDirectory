import { SPUser } from "../components/spuser";
import { HttpClient, HttpClientConfiguration, HttpClientResponse } from "@microsoft/sp-http";
import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import * as $ from "jquery";
import { SPHttpClient,SPHttpClientResponse,ISPHttpClientOptions} from '@microsoft/sp-http';
import { Promise } from "es6-promise";
import { IHttpClientOptions } from "@microsoft/sp-http/lib/httpClient/HttpClient";
import { DirectoryService } from "./DirectoryService";




var directoryService = new DirectoryService();

export class SPUserService {

    constructor(private context: IWebPartContext) {
    }
    

    public loggedUser(): Promise<SPHttpClientResponse>{
        var url = `${this.context.pageContext.web.absoluteUrl}/_api/sp.userprofiles.peoplemanager/GetMyProperties`;
          return new Promise<any>((resolve, reject) => {
            this.context.spHttpClient.get(
                  url,
                  SPHttpClient.configurations.v1).then((resp) => {
                      return resp.json().then((data) => {
                       resolve(data)
                      }).catch((error) => { console.log(error); });
                  }).catch((error) => {
                      console.log(error);
                  });
          })
    }

public getAllUsers() : Promise<SPHttpClientResponse> {
   
var url = `${this.context.pageContext.web.absoluteUrl}/_vti_bin/ListData.svc/UserInformationList?$expand=ContentType&$filter=ContentType eq 'Person'`;
return this.context.spHttpClient.get(
    url,
    SPHttpClient.configurations.v1,
    { 
         mode: 'no-cors'
    }
).then(
    (response : SPHttpClientResponse) => {
        
        return response.json();
    }
);
}

// public getUserProperties(): Promise<SPHttpClientResponse>{
//            var url = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/getbytitle('EmployeeDirectoryConfigurations')/Items`;
//              return new Promise<any>((resolve, reject) => {
//                this.context.spHttpClient.get(
//                      url,
//                      SPHttpClient.configurations.v1).then((resp) => {
//                          return resp.json().then((data) => {
//                           resolve(data)
//                          }).catch((error) => { console.log(error); });
//                      }).catch((error) => {
//                          console.log(error);
//                      });
//              })
//        }

       public setCardProperties(data,viewType:string,DefaultTheme:string,colorPickerValueForText:string,NodeBackgroundColor:string,IsRoundedCornersEnabled:boolean,IsRoundedImage:boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const personaProperties: ISPHttpClientOptions = {  body: JSON.stringify({
                '__metadata': {
                  'type':  'SP.Data.EmployeeDirectoryConfigurationsListItem'
                },
                'Title':"UserPersonaConfigurations", 'Name': "Name",'secondaryText': `${data[0]}`,'tertiaryText':`${data[1]}`,'ShowRoundedImage':`${IsRoundedImage}`,'quaternaryText': `${data[2]}`,'quinaryText':`${data[3]}`, 'ThemeType':  `${DefaultTheme}`,'NodeTextColor': `${colorPickerValueForText}`,'ShowRoundedCorners': `${IsRoundedCornersEnabled}`,'NodeBackgroundColor':`${NodeBackgroundColor}`,'ViewType': `${viewType}`
              })};
            this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDirectoryConfigurations')/items`, SPHttpClient.configurations.v1, personaProperties)
                .then((response: SPHttpClientResponse) => {
                    alert(`Announcemnet is successfully Created `);
                    response.json().then((responseJSON: any) => {
                        resolve(responseJSON.ID)
                    });
                });
        })
    }

    public UpdateCardProperties(data,ItemID:number,viewType:string,DefaultTheme:string,colorPickerValueForText:string,NodeBackgroundColor:string,IsRoundedCornersEnabled:boolean,IsRoundedImage:boolean): Promise<boolean> {
        const body: string = JSON.stringify({
            '__metadata': {
              'type':  'SP.Data.EmployeeDirectoryConfigurationsListItem'
            },
            'Title':"UserPersonaConfigurations", 'Name': "Name", 'secondaryText': `${data[0]}`,'tertiaryText':`${data[1]}`,'ShowRoundedImage':`${IsRoundedImage}`,'quaternaryText': `${data[2]}`,'quinaryText':`${data[3]}`, 'ThemeType':  `${DefaultTheme}`,'NodeTextColor': `${colorPickerValueForText}`,'ShowRoundedCorners': `${IsRoundedCornersEnabled}`,'NodeBackgroundColor':`${NodeBackgroundColor}`,'ViewType': `${viewType}`
          });
            return this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDirectoryConfigurations')/items(${ItemID})`,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  'Accept': 'application/json;odata=nometadata',
                  'Content-type': 'application/json;odata=verbose',
                  'odata-version': '',
                  'IF-MATCH': "*",
                  'X-HTTP-Method': 'MERGE'
                },
                body: body
              })
          
          .then((response: SPHttpClientResponse): boolean => {
            return true;
          }, (error: any): boolean => {
            return false;
          });
      }

      public UpdateTileProperties(data,ItemID:number,viewType:string,DefaultTheme:string,colorPickerValueForText:string,NodeBackgroundColor:string,IsRoundedCornersEnabled:boolean,IsRoundedImage:boolean): Promise<boolean> {
        const body: string = JSON.stringify({
            '__metadata': {
              'type':  'SP.Data.EmployeeDirectoryConfigurationsListItem'
            },
            'Title':"UserPersonaConfigurations", 'Name': "Name", 'secondaryTextForCard': `${data[0]}`,'teritaryTextForCard':`${data[1]}`,'ShowRoundedImage':`${IsRoundedImage}`, 'ThemeType':  `${DefaultTheme}`,'NodeTextColor': `${colorPickerValueForText}`,'ShowRoundedCorners': `${IsRoundedCornersEnabled}`,'NodeBackgroundColor':`${NodeBackgroundColor}`,'ViewType': `${viewType}`
          });
            return this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDirectoryConfigurations')/items(${ItemID})`,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  'Accept': 'application/json;odata=nometadata',
                  'Content-type': 'application/json;odata=verbose',
                  'odata-version': '',
                  'IF-MATCH': "*",
                  'X-HTTP-Method': 'MERGE'
                },
                body: body
              })
          
          .then((response: SPHttpClientResponse): boolean => {
            return true;
          }, (error: any): boolean => {
            return false;
          });
      }

      public setDynamicCSSToList(AlphabetBackgroundColor:string,AlphabetTextColor:string,HideAlphabets:boolean): Promise<any> {
     return new Promise<any>((resolve, reject) => {
         const personaProperties: ISPHttpClientOptions = {  body: JSON.stringify({
             '__metadata': {
               'type':  'SP.Data.EmployeeDirectoryConfigurationsListItem'
             },
             'Title':"UserPersonaConfigurations", 'ShowAlphabets':`${HideAlphabets}`,'AlphabetBackgroundColor': `${AlphabetBackgroundColor}`,'AlphabetTextColor': `${AlphabetTextColor}`
           })};
         this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDirectoryConfigurations')/items`, SPHttpClient.configurations.v1, personaProperties)
             .then((response: SPHttpClientResponse) => {
                 alert(`Announcemnet is successfully Created `);
                 response.json().then((responseJSON: any) => {
                     resolve(responseJSON.ID)
                 });
             });
     })
 }

 public UpdateDynamicCSSToList(ItemID:number,AlphabetBackgroundColor:string,AlphabetTextColor:string,HideAlphabets:boolean): Promise<boolean> {
     const body: string = JSON.stringify({
         '__metadata': {
           'type':  'SP.Data.EmployeeDirectoryConfigurationsListItem'
         },
         'ShowAlphabets':`${HideAlphabets}`,'AlphabetBackgroundColor': `${AlphabetBackgroundColor}`,'AlphabetTextColor':`${AlphabetTextColor}`
       });
         return this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('EmployeeDirectoryConfigurations')/items(${ItemID})`,
           SPHttpClient.configurations.v1,
           {
             headers: {
               'Accept': 'application/json;odata=nometadata',
               'Content-type': 'application/json;odata=verbose',
               'odata-version': '',
               'IF-MATCH': "*",
               'X-HTTP-Method': 'MERGE'
             },
             body: body
           })
       
       .then((response: SPHttpClientResponse): boolean => {
         return true;
       }, (error: any): boolean => {
         return false;
       });
   }

}
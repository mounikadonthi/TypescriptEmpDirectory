import  CryptoJS from 'crypto-js';
export var licenseUtility = {
   $ : require ('jquery'),
 //  CryptoJS : require('crypto-js'),
    apiUrl: "https://license.technovert.com/v2/api/license/",
   // apiUrl: "https://licensestage.technovert.com/api/license/",
    licenseList: "saketa",
    binaryInfo: '', scj: CryptoJS, decimalInfo: '',
    invalidKey: "Invalid license key",
    licenseExpired: "Your license has expired",
    invalidLicense: "Your License is invalid",
    version: "1.0.0.0",
    appWebUrl: "",
    hostWebUrl: "",
    currentUser: null,
    trialKey: null,
    requestId: null,
    productGuid: "{48BA5F7B-7AA5-4E69-8E52-E80C4700F3EC}",
    // sendRequest: function (method, url, data, callback, failure) {
    //       licenseUtility.$.ajax({
    //         type: method,
    //         url: url,
    //         data: data,
    //         async: false,
    //         headers: { "Accept": "application/json; odata=verbose" },
    //         success: function (response) {
    //             callback(response);
    //         },
    //         error: function (response) {
    //             failure(response);
    //         }
    //     });
       
   
    // },
    sendRequest: function (method, url, data, callback, failure) {
        licenseUtility.$.ajax({
            type: method,
            url: url,
            data: data,
            error: function (jqXhr, textStatus, errorThrown) {
                //console.log(jqXHR + ', ' + textStatus);
                failure(jqXhr.responseText);
            }
        }).done(function (response) {
            callback(response);
        });
    },
    readDecimal: function (encryptedData) {
        var decimalData = null;
        try {
            //Creating the Vector Key
            var iv = licenseUtility.scj.enc.Hex.parse('a5b8d2e9c1721ae0e84ad660c472b1f3');
            //Encoding the Password in from UTF8 to byte array
            var Pass = licenseUtility.scj.enc.Utf8.parse('9pcm5rva5ufsr4shfoke');
            //Encoding the Salt in from UTF8 to byte array
            var Salt = licenseUtility.scj.enc.Utf8.parse("fqyql85vk6xlik8e162h");
            //Creating the key in PBKDF2 format to be used during the decryption
            var key128Bits1000Iterations = licenseUtility.scj.PBKDF2(Pass.toString(licenseUtility.scj.enc.Utf8), Salt, { keySize: 128 / 32, iterations: 1000 });
            //Enclosing the test to be decrypted in a CipherParams object as supported by the licenseUtility.scj libarary
            var cipherParams = licenseUtility.scj.lib.CipherParams.create({
                ciphertext: licenseUtility.scj.enc.Base64.parse(encryptedData)
            });

            //Decrypting the string contained in cipherParams using the PBKDF2 key
            var decrypted = licenseUtility.scj.AES.decrypt(cipherParams, key128Bits1000Iterations, { mode: licenseUtility.scj.mode.CBC, iv: iv, padding: licenseUtility.scj.pad.Pkcs7 });
            decimalData = decrypted.toString(licenseUtility.scj.enc.Utf8);
            return decimalData;
        }
        //Malformed UTF Data due to incorrect password
        catch (err) {
            return "";
        }
    },
    readBinary: function (textString) {
        var binaryData = null;
        try {
            //Creating the Vector Key
            var iv = licenseUtility.scj.enc.Hex.parse('a5b8d2e9c1721ae0e84ad660c472b1f3');
            //Encoding the Password in from UTF8 to byte array
            var Pass = licenseUtility.scj.enc.Utf8.parse('9pcm5rva5ufsr4shfoke');
            //Encoding the Salt in from UTF8 to byte array
            var Salt = licenseUtility.scj.enc.Utf8.parse("fqyql85vk6xlik8e162h");
            //Creating the key in PBKDF2 format to be used during the decryption
            var key128Bits1000Iterations = licenseUtility.scj.PBKDF2(Pass.toString(licenseUtility.scj.enc.Utf8), Salt, { keySize: 128 / 32, iterations: 1000 });

            //Encrypting the string contained in cipherParams using the PBKDF2 key
            var encrypted = licenseUtility.scj.AES.encrypt(textString, key128Bits1000Iterations, { mode: licenseUtility.scj.mode.CBC, iv: iv, padding: licenseUtility.scj.pad.Pkcs7 });
            binaryData = encrypted.ciphertext.toString(licenseUtility.scj.enc.Base64);
            return binaryData;
        }
        //Malformed UTF Data due to incorrect password
        catch (err) {
            return "";
        }
    },

    getListUserEffectivePermissions: function (webUrl, listTitle, accountName) {
        var endpointUrl = webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/getusereffectivepermissions(@u)?@u='" + accountName + "'";
        return licenseUtility.$.getJSON(endpointUrl);
    },


    doesUserHasPermission: function (data) {
        var hasPermission = false;
        var permissions = new SP.BasePermissions();
        permissions.initPropertiesFromJson(data);
        if (permissions.has(SP.PermissionKind.addListItems)) {
            hasPermission = true;
        }
        return hasPermission;
    },

    userHasPermission: function (webUrl) {
        var hasPermission = false;
        var url = webUrl + "/_api/web/doesuserhavepermissions(@v)?@v={'High':'0','Low':'2'}";
        licenseUtility.getData(url, false, function (data) {
            if (data)
                hasPermission = data.d.DoesUserHavePermissions;
        }, function (data) {
            if (data.status == 403)
                hasPermission = false;
            else
                hasPermission = true;
        });
        return hasPermission;
    },

    checkUserHasPermission: function (url) {
        var hasPermission = false;
        licenseUtility.getData(url + "/_api/web/currentuser", false, function (data) {
            licenseUtility.getListUserEffectivePermissions(url, 'Saketa', data.d.LoginName.replace("#", "%23"))
        .done(function (data) {
            if (licenseUtility.doesUserHasPermission(data))
                hasPermission = true;

        }).fail(function (data) {
            if (data.status == 403)
                hasPermission = false;
            else
                hasPermission = true;
        });
        }, function (data) { });
        return hasPermission;

    },

    updateItem: function (webUrl, listName, updatedItem, success, failure) {

        var apiUrl = webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
        licenseUtility.getData(apiUrl, true, function (data) {
            if (data.d.results.length > 0) {
                url = data.d.results[0].__metadata.uri;
                header = {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": licenseUtility.$("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                }
            }
            else {
                url = webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
                header = {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": licenseUtility.$("#__REQUESTDIGEST").val()
                }
            }
            licenseUtility.$.ajax({
                url: url,
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(updatedItem),
                headers: header,
                success: function (data) {
                    success(data);
                },
                error: function (data) {
                    failure(data.responseText);
                }
            });
        },
        function (data) {
            failure(data.responseText);
        });
    },

    postData: function (url, itemProperties, success, failure) {
        url = licenseUtility.apiUrl + url;
        licenseUtility.$.ajax({
            url: url,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(itemProperties),
            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": licenseUtility.$("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    },

    getData: function (resourceUrl, isSync, success, failure) {
        return new Promise((resolve, reject) => {    licenseUtility.$.ajax({
            url: resourceUrl,
            method: "GET",
            async: isSync,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
        resolve(true);
    })
    },

    getItemTypeForList: function (name) {
        return "SP.Data." + name.charAt(0).toUpperCase() + name.slice(1) + "ListItem";
    },

    getQueryStringParameter: function (paramToRetrieve) {
        if (document.URL.split("?").length > 1) {
            var params = _spPageContextInfo;
            licenseUtility.hostWebUrl =  _spPageContextInfo.webAbsoluteUrl;
            // for (var i = 0; i < params.length; i = i + 1) {
            //     var singleParam = params[i].split("=");
            //     if (singleParam[0] == paramToRetrieve)
            //         return singleParam[1];
            // }
            return _spPageContextInfo.webAbsoluteUrl
        }
        else
            return "";
    },

    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    },

    hasRequiredProp: function (licenseData) {
        var licenseObj = { 'ActivationId': '', 'NextPollDate': '', 'LicenseKey': '', 'ExpiryDate': '', 'HostUrl': '' };
        for (var name in licenseObj) {
            if (!licenseData.hasOwnProperty(name))
                return false;
        }
        return true;
    },

    setCookie: function (data) {
        var d = new Date();
        d.setTime(d.getTime() + (5 * 24 * 60 * 60 * 1000));
        document.cookie = "skey=true;expires=" + d.toUTCString() + ";path=/";
        var eDays = JSON.stringify({ EDate: data.ExpiryDate, Type: data.IsTrial, PDate: data.NextPollDate });
        document.cookie = 'eDays=' + eDays + ';expires=' + d.toUTCString() + ';path=/';
    },

    checkPolling: function (licenseData, licenseMetaData) {
        var paramString = JSON.stringify({ LicenseKey: licenseData.LicenseKey, ActivationId: licenseData.ActivationId, IsTrial: licenseData.IsTrial });
        var encryptedParam = licenseUtility.readBinary(paramString);
        var url = licenseUtility.apiUrl + "isactive/" + encryptedParam.replace(/\//g, '_').replace(/\+/g, '-');
        var eDays = { days: licenseData.ExpiryDate ? licenseUtility.getExpirationDays(licenseData.ExpiryDate) : "", Type: licenseData.IsTrial };

        licenseUtility.sendRequest('GET', url, null, function (encryptedData) {
            try {
                var decryptedString = licenseUtility.readDecimal(encryptedData);
                if (decryptedString !== "") {
                    var decryptedJson = JSON.parse(decryptedString);
                    if (decryptedJson.IsActive) {
                        licenseData.NextPollDate = decryptedJson.NextPollDate;
                        licenseData.Message = decryptedJson.Message;
                        licenseData.ExpirationDays = decryptedJson.ExpirationDays;

                        if (licenseUtility.userHasPermission(licenseMetaData.appweb)) {
                            var setting = {
                                skey: licenseUtility.readBinary(JSON.stringify(licenseData)),
                                __metadata: {
                                    type: "SP.Data.ResourcesListItem"
                                }
                            }
                            licenseUtility.updateItem(licenseMetaData.appweb, licenseUtility.licenseList, setting, function (data) {
                                licenseUtility.setCookie(licenseData);
                                licenseMetaData.success(eDays);
                            }, licenseUtility.onResponseError);
                        } else {
                            licenseUtility.setCookie(licenseData);
                            licenseMetaData.success(eDays);
                        }
                    }
                    else
                        licenseUtility.licenseFailure(licenseUtility.licenseExpired, licenseMetaData);
                }
                else
                    licenseUtility.licenseFailure(licenseUtility.invalidLicense, licenseMetaData);
            }
            catch (ex) {
                licenseMetaData.failure(ex);
            }
        }, function (error) {
            licenseUtility.setCookie(licenseData);
            licenseMetaData.success(eDays);
        });
    },


    checkIsPollRequired: function (licenseData) {
        var currentDate = new Date();
        var nextPollDate = new Date(licenseData.NextPollDate);
        if (currentDate.getTime() < nextPollDate.setHours(23, 59, 59, 0)) {
            licenseUtility.setCookie(licenseData);
            return false;
        }
        return true;
    },

    validateLicense: function (licenseMetaData) {

        licenseMetaData.appweb = decodeURIComponent(this.getQueryStringParameter("SPAppWebUrl"));
        licenseMetaData.hostweb = decodeURIComponent(this.getQueryStringParameter("SPHostUrl"));

        if (licenseMetaData.hostweb.lastIndexOf("/") !== licenseMetaData.hostweb.length - 1)
            licenseMetaData.hostweb = licenseMetaData.hostweb + "/";
        var licenseKey = licenseUtility.getCookie("skey");
        var nextPollDate = '';
        var expiryDate = "";

        var dates = licenseUtility.getCookie("eDays") ? JSON.parse(licenseUtility.getCookie("eDays")) : "";
        if (dates != "") {
            expiryDate = dates.EDate != "" ? new Date(dates.EDate).setHours(23, 59, 59, 0) : "";
            nextPollDate = dates.PDate != "" ? new Date(dates.PDate).setHours(23, 59, 59, 0) : "";
        }

        if (licenseKey) {
            if (expiryDate >= new Date().getTime() && nextPollDate > new Date().getTime()) {
                var eDays = { days: dates != "" ? licenseUtility.getExpirationDays(dates.EDate) : '', Type: dates && dates.Type };
                licenseMetaData.success(eDays);
            } else {
                licenseUtility.checkLicenseFromList(licenseMetaData);
            }
        }
        else {
            licenseUtility.checkLicenseFromList(licenseMetaData);

        }
    },

    checkLicenseFromList: function (licenseMetaData) {
        var apiUrl = licenseMetaData.appweb + "/_api/web/lists/getbytitle('" + licenseUtility.licenseList + "')/items";
        licenseUtility.getData(apiUrl, true, function (data) {
            if (data.d.results.length > 0 && data.d.results[0].skey) {
                var licenseSetting = data.d.results[0].skey;
                var decryptedLicense = licenseUtility.readDecimal(licenseSetting);
                if (decryptedLicense !== "" && decryptedLicense !== null && decryptedLicense !== undefined) {
                    var licenseData = JSON.parse(decryptedLicense);
                    if (licenseUtility.hasRequiredProp(licenseData) && decodeURIComponent(licenseData.HostUrl) === licenseMetaData.hostweb) {
                        var expDate = new Date(licenseData.ExpiryDate).setHours(23, 59, 59, 0);
                        var today = new Date().getTime();
                        if (expDate < today)
                            licenseUtility.licenseFailure(licenseUtility.licenseExpired, licenseMetaData);
                        else {
                            var eDays = { days: licenseUtility.getExpirationDays(licenseData.ExpiryDate), Type: licenseData.IsTrial };
                            if (licenseUtility.checkIsPollRequired(licenseData))
                                licenseUtility.checkPolling(licenseData, licenseMetaData);
                            else {
                                licenseUtility.setCookie(licenseData);
                                licenseMetaData.success(eDays);
                            }
                        }
                    }
                    else
                        licenseUtility.licenseFailure(licenseUtility.invalidKey, licenseMetaData);
                }
                else
                    licenseUtility.licenseFailure(licenseUtility.invalidKey, licenseMetaData);
            }
            else
                licenseMetaData.failure();
        }, licenseUtility.onResponseError);
    },

    licenseFailure: function (message, licenseMetaData) {
        alert(message);
        licenseMetaData.failure();
    },

    getExpirationDays: function (expDate) {
        var today = new Date();
        expDate = new Date(expDate);
        var expTime = Math.floor(expDate.setHours(23, 59, 59, 0) / (3600 * 24 * 1000)); //days as integer from..
        var toDayTime = Math.floor(today.getTime() / (3600 * 24 * 1000));
        return (expTime - toDayTime);
    },
    requestLicense: function () {
        var requestLicense = {
            orgName: licenseManaager.parser.hostname,
            productGuid: licenseManaager.productGuid,
            requiredParam: licenseManaager.hostWebUrl,
            requestorEmail: licenseManaager.currentUser.Email || $("#formBuyLicense #userEmail").val(),
            comments: "Phone:" + $("#formBuyLicense #userPh").val() + ";" + $("#taBuyShortNote").val(),
        };
        var url = licenseUtility.apiUrl + "requestlicense";
        licenseUtility.sendRequest("POST", url, requestLicense, function (data) {
            if (data.submitted) {
                licenseManaager.toggleForms("#formLicenseActions");
                $("#formLicenseActions .form-block-msg").text("Thank you. Our sales team shall get back to you shortly !");
            }
        }, function (data) {
            alert("Can't process your request, please try after some time");
        });

    },

    getQueryVariable: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    },

    activateLicense: function (licenseKey, isTrial, methodName) {
        licenseUtility.getData(licenseUtility.appWebUrl + "/_api/web/currentuser", false, function (data) {
            licenseUtility.currentUser = data.d
                }, licenseUtility.onResponseError)
        var activationRequest = {
            licenseKey: licenseKey,
            productGuid: licenseUtility.productGuid,
            userName: licenseUtility.currentUser.Email ? licenseUtility.currentUser.Email : licenseUtility.currentUser.LoginName,
            timeZone: new Date().getTimezoneOffset(),
            version: licenseUtility.version,
            isTrial: isTrial,
            //  isTrialReActivation: isTrialReactivation,

            additionalParameters: {
                "machineName": "",
                "machineId": "",
                "webUrl": decodeURIComponent(this.getQueryStringParameter("SPAppWebUrl")),
                "appUrl": decodeURIComponent(this.getQueryStringParameter("SPAppWebUrl"))
            }
        };
        if (activationRequest.isTrial) {
            //activationRequest.type = 1
            activationRequest.additionalParameters.userCount = 0;
            activationRequest.requestId = licenseUtility.requestId;
            methodName = "activatetrial";
        }
            
        var url = licenseUtility.apiUrl + methodName;

        licenseUtility.sendRequest('POST', url, activationRequest, function (licenseKey) {
            var decryptedString = licenseUtility.readDecimal(licenseKey);
            var licenseMsg = "";
            var response = JSON.parse(decryptedString);
            if (response.IsActivated === true) {
                response.HostUrl = licenseUtility.getQueryStringParameter("SPHostUrl");
                encryptedData = licenseUtility.readBinary(JSON.stringify(response));
                var setting = {
                    Title: "Saketa",
                    skey: encryptedData,
                    IsAppInstallation: false
                }
                setting.__metadata = { type: "SP.Data.ResourcesListItem" };
               // if (licenseUtility.cbisTrail.is(":checked") || isTrial) {
                    var expDate = new Date(response.ExpiryDate);
                    var days = licenseUtility.getExpirationDays(expDate);
                  //  licenseMsg = "Your trial has been activated for <span class='expirationDays'>" + days + " </span>days.";
               // }
                // else
                //     licenseMsg = "Your license has been activated successfully";

                // licenseUtility.updateItem(licenseUtility.appWebUrl, licenseUtility.licenseList, setting, function (data) {
                //   //  licenseUtility.toggleForms("#formTrialSuccess,#licenseFooter");
                //   //  $('#formTrialSuccess .form-msg').html(licenseMsg);
                // }, function (data) {
                //     alert(data.responseText);
                // });

            }
            else {
                // $('#btnActivateTrial,#btnActivateLicense').attr("disabled", false);
                // $('#btnActivateTrial').val('Activate Trial');
                // $('#btnActivateLicense').val("Submit");
                alert("Invalid License key!");
            }
        }, licenseUtility.onResponseError);
    
    },
    
    submitUserInfo: function (obj,licenseMetaData) {
        debugger;
        return new Promise((resolve, reject) => {  licenseUtility.appWebUrl =  decodeURIComponent(this.getQueryStringParameter("SPAppWebUrl"));  
        licenseUtility.getData(licenseUtility.appWebUrl + "/_api/web/currentuser", false, function (data) {
            licenseUtility.currentUser = data.d
                }, licenseUtility.onResponseError).then(function(userResponse) {
        var request = {
            contactEmail: obj.Email,
            orgName: obj.OrgName,
            contactName: obj.ContactName,
            contactNumber: obj.ContactNumber,
            domain: obj.OrgName,
            productGuid: licenseUtility.productGuid,
            version: licenseUtility.version,
            requiredParam1: licenseUtility.hostWebUrl,
            additionalParameters: JSON.stringify({
                "UserEmail": licenseUtility.currentUser.Email ? licenseUtility.currentUser.Email : licenseUtility.currentUser.LoginName,
            })
        }

        var url = licenseUtility.apiUrl + 'requesttrial';
       
        licenseUtility.sendRequest('POST', url, request, function (response) {
            if (response && response.canActivate) {
               // licenseManaager.toggleForms('#formActivateTrial');
                // $('#formUserInfo').addClass('hide');
                // $('#formActivateTrial').removeClass('hide');
                licenseUtility.requestId = response.requestId;
                licenseUtility.trialKey = response.licenseKey;
               // this.licenseUtility.activateLicense(this.state.LicenceKey,this.state.isTrailChecked,'activate')
                licenseMetaData.success();
            }
            else {
                licenseMetaData.success();
               // alert("Email Already exist")
                
            }
        },  licenseUtility.onResponseError)
    })
   })
    }

}
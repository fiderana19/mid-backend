export function setReportAudienceMail(nom, prenom, old_availability, old_hour_debut, old_hour_end, new_availability, new_hour_debut, new_hour_end, qrCodeDataToURL) {
    const mailBody = `
      <html lang="en">
  <head>
      <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      </head>
      <body style="background: #f1f1f1">
        <table role="Presentation" width="100%" cellspacing="0" cellpadding="0" border="0" >
          <tbody> 
           <tr> 
            <td align="left"> 
              <!---Header--->
              <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
                <tbody><tr>
                  <td style="background: green">
                    <table role="Presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: grey; padding: 10px 40px;">
                      <tbody> 
                      <tr> 
                        <td align="left"> 
                        <table style="border:none;border-collapse:collapse;display:inline-table;float:right" valign="top"  cellspacing="0" cellpadding="0" border="0" align="right"> 
                          <tbody> 
                            <tr> 
                            <td valign="middle" align="left"> 
                              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody> 
                                <tr> 
                                <td valign="middle" height="54" align="center">
                                  <td valign="middle" height="54" align="center">
                                    <div style="font-size: 25px;color: white;font-weight: bold; text-align: right;">
                                      <div style="font-size: 18px;  margin: 10px 0;">
                                        Ministère de l'Interieur
                                      </div>
                                      <div style="font-size: 22px;">
                                        MININTER: Audience
                                      </div>
                                    </div>
                                  </td> 
                                </td> 
                                </tr> 
                              </tbody>
                              </table>
                            </td> 
                            </tr> 
                          </tbody>  
                    </table>
                  <table style="border:none;border-collapse:collapse;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="left"> 
                    <tbody> 
                    <tr> 
                      <td valign="middle" align="left"> 
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tbody> 
                        <tr> 
                          <img src="cid:mid" alt="Mininter Logo" style="width: 70px;height: 70px;object-fit: cover;" />
                        </tr> 
                        </tbody>
                      </table>
                      </td> 
                    </tr> 
                    </tbody> 
                  </table> 
                  </td> 
                </tr> 
                </tbody> 
              </table> 
              </td> 
            </tr> 
            </tbody> 
          </table>
          </td>
        </tr>
        <tr>
          <td>
            <!---Body--->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
              <tbody><tr>
                <td style="background:white; color: black;text-align:center">
                  <div style="padding: 40px;background: white;text-align: center;">
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Audience Reporté</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Votre audience avec le ministre le ${old_availability} de ${old_hour_debut} à ${old_hour_end} a été reporté pour la date de ${new_availability} de ${new_hour_debut} à ${new_hour_end} .<br>
                      Ce report est dû au changement de la disponbilité du ministre .<br >
                      Ci-joint votre QR code, votre ticket d'entrée. N'oubliez pas votre carte d'identité.
                      <div>
                        <img src=${qrCodeDataToURL} alt="Mininter Logo" style="width: 250px; height: 250ox; object-fit: cover; margin: 0 auto;" />
                      </div>
                    </div>
                  </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                    Vous avez reçu cet email parce que une audience avec le ministre a été reporté sur le site d'audience du ministère de l'interieur.
                  </div>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
        <tr>
          <td>
            <!--Footer--->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
              <tbody><tr>
                <td style="background: green">
                  <table role="Presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: grey; padding: 40px;">
                    <tbody> 
                    <tr> 
                      <td align="left"> 
                      <table style="border:none;border-collapse:collapse;display:inline-table;float:right" valign="top"  cellspacing="0" cellpadding="0" border="0" align="right"> 
                        <tbody> 
                          <tr> 
                          <td valign="middle" align="left"> 
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tbody> 
                              <tr> 
                              <td valign="middle" height="54" align="center">
                                <img src="cid:mid" alt="Mininter Logo" style="width: 70px;height: 70px;object-fit: cover;" />
                              </td> 
                              </tr> 
                            </tbody>
                            </table>
                          </td> 
                          </tr> 
                        </tbody>  
                  </table>
                <table style="border:none;border-collapse:collapse;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="left"> 
                  <tbody> 
                  <tr> 
                    <td valign="middle" align="left"> 
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody> 
                      <tr> 
                        <td valign="middle" height="54" align="center">
                          <div style="font-size: 25px;color: white;font-weight: bold; text-align: left;">
                            <div style="font-size: 16px;">
                              Ministère de l'Interieur
                            </div>
                            <div style="font-size: 20px; margin: 10px 0;">
                              MININTER: Audience
                            </div>
                            <div style="font-size: 12px;">
                              @copyright 2024
                            </div>
                          </div>
                        </td> 
                      </tr> 
                      </tbody>
                    </table>
                    </td> 
                  </tr> 
                  </tbody> 
                </table> 
                </td> 
              </tr> 
              </tbody> 
            </table>  
          </td>
        </tr>
      </tbody></table>
    </body>
    </html>

  `;
    return mailBody;
}
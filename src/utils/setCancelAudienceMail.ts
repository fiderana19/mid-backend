export function setCancelAudienceMail(
  nom,
  prenom,
  date_availability,
  hour_debut,
  hour_end,
) {
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
                        <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Audience annulé !</div>
                        <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                          Bonjour <b class="font-weight: bold">${nom} ${prenom}</b>.<br > 
                          Le ministère de l'interieur s'excuse parce que votre audience avec le ministre le <b class="font-weight: bold">${date_availability}</b> de <b class="font-weight: bold">${hour_debut}</b> à <b class="font-weight: bold">${hour_end}</b> a été annulée.<br>
                          Le ministre a des occupations urgentes pour ce date.
                        </div>
                      </div>
                      <div style="height: 1px; background: gray;"></div>
                      <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                        Vous avez reçu cet email parce que votre audience a été annulée sur le site d'audience du ministère de l'interieur.
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

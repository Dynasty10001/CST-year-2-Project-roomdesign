
CREATE (cabt1:CabinetTemplate {posx: 0, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, sectionCode: "1V-D=L|T", cabNomenclature: "SB-1D-2S", cabWidth: 15.875000, cabHeight: 34.875000, cabDepth: 24.000000, cabIdentifier: 42359, modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/SimpleCab.obj", photoPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-photo-assets/SB-2DR face.jpg", cabName: "MockCab1",isUpper: false})  

CREATE (cabt2:CabinetTemplate {posx: 20, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, sectionCode: "2H=24 5/8=7 1/4-D=L-W|T", cabNomenclature: "SB-1D-1DR-1S", cabWidth: 15.875000, cabHeight: 34.875000, cabDepth: 24.000000, cabIdentifier: 42189, modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/cab1 dxf.obj", photoPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-photo-assets/SB1D1DR-1S.jpg", cabName: "MockCab2", isUpper: false})  

CREATE (cabt3:CabinetTemplate {posx: 40, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, sectionCode: "1V-D=L|T", cabNomenclature: "SB-1D-2S", cabWidth: 15.875000, cabHeight: 34.875000, cabDepth: 24.000000, cabIdentifier: 42359, modelPath: " https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/cab2 dxf.obj", photoPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-photo-assets/SB3EDR.jpg", cabName: "MockCab3", isUpper: false})  

CREATE (cabt4:CabinetTemplate {posx: 40, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, sectionCode: "1V-D=L|T", cabNomenclature: "SB-1D-2S", cabWidth: 10.000000, cabHeight: 60, cabDepth: 10.000000, cabIdentifier: 42360, modelPath: " https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/cab2 dxf.obj", photoPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-photo-assets/SB4DR(3E).jpg", cabName: "MockDifDimens", isUpper: false})  

CREATE (upperCabt1:CabinetTemplate {isUpper: true, posx: 40, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, sectionCode: "1V-D=L|T", cabNomenclature: "SB-1D-2S", cabWidth: 15.875000, cabHeight: 34.875000, cabDepth: 24.000000, cabIdentifier: 42359, modelPath: " https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/cab2 dxf.obj", photoPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-photo-assets/SB-Empty.jpg", cabName: "MockUpper1"})  
CREATE (upperCabt2:CabinetTemplate {isUpper: true, posx: 40, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, sectionCode: "1V-D=L|T", cabNomenclature: "SB-1D-2S", cabWidth: 15.875000, cabHeight: 34.875000, cabDepth: 24.000000, cabIdentifier: 42359, modelPath: " https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/Empty Base.obj", photoPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-photo-assets/SB1D1DR-1S.jpg", cabName: "MockUpper2"})  

CREATE (door1:DoorTemplate {doorStyle:"Westbank", modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/door dxf.obj", photoPath: "photo.png"})  

CREATE (door2:DoorTemplate {doorStyle:"East Coast 12", modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/door dxf.obj", photoPath: "photo.png"}) 
CREATE (door3:DoorTemplate {doorStyle:"East Coast 12", modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/door dxf.obj", photoPath: "photo.png"}) 
// CREATE (door4:DoorTemplate {doorID:4,doorStyle:"East Coast 13", modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/door dxf.obj"}) 



CREATE (st1:StyleTemplate {styleName: "East Coast 12", material: "MDF - Spray MB", outsideEdge: "", insideEdge: "", raisedPanel: "", routePattern: "EastCoast", databaseName: "TLD DOORS", THEOTHEREMPTYSTRING: "" }) 

CREATE (st2:StyleTemplate {styleName: "Westbank", material: "MDF - Spray 3/4", outsideEdge: "", insideEdge: "", raisedPanel: "", routePattern: "Westbank", databaseName: "TLD DOORS", THEOTHEREMPTYSTRING: "" }) 
CREATE (cabt1)-[:CONTAINS_THIS_DOOR{offset:[11,20,30]}]->(door1) 
CREATE (cabt2)-[:CONTAINS_THIS_DOOR{offset:[10,20,30]}]->(door2) 
CREATE (cabt3)-[:CONTAINS_THIS_DOOR{offset:[10,20,30]}]->(door3) 
CREATE (cabt4)-[:CONTAINS_THIS_DOOR{offset:[10,20,30]}]->(door2) 
CREATE (upperCabt1)-[:CONTAINS_THIS_DOOR{offset:[10,20,30]}]->(door1) 
CREATE (upperCabt2)-[:CONTAINS_THIS_DOOR{offset:[10,20,30]}]->(door3) 
RETURN cabt1
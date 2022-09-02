//
//  VideoEditorModule.swift
//  vesdkreactnativeintegrationsample
//
//  Created by Andrei Sak on 28.12.20.
//
import React
import BanubaVideoEditorSDK
import BanubaMusicEditorSDK
import BanubaOverlayEditorSDK
import VideoEditor
import VEExportSDK

@objc(VideoEditorModule)
class VideoEditorModule: NSObject, RCTBridgeModule {
  
  private var videoEditorSDK: BanubaVideoEditor?
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  private var currentResolve: RCTPromiseResolveBlock?
  private var currentReject: RCTPromiseRejectBlock?
  
  // Export callback
  @objc func openVideoEditor(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    let config = createVideoEditorConfiguration()
    videoEditorSDK = BanubaVideoEditor(
      token: "BxA7hQ4+SDQQs04YD2TL5zRKfEC8pkAjGbiOTzWJ+UyEsE3ZzRBycnrME6qVAvJwsa9EERzANbgcTzDyCUu+UJ8YwbOZIPKfGNEbaK2JgnNGyOk3fX6lsijlw0+ElLvnXhaxatxcuYQs1VvLUW8DWB/2mQREUsBYhsz4w4/aoUE7O3YlVWrFOhHDbh6NRuFxRfdhdKVRuouIadHtyGiHNE4VLBOsArDrRgab3TyNp0jmW6ctyJr/d4Bf9dgkp2fryX1v8KMTw72Ov+p/4snig61261odwElV5+/t+40MkAEbOn3n/q1kfqUB8T+nwqYmSBzZWv/jqjEVwaLZImvNaKALztSUkAsAOi5Z0CesiHc+KxVK02ThxQEajelgXhB2R51Fr0f3y2//p9yYZzwdKqAz87C/Do7xPi81+KZcctkvnFJRh16onpPQfEJnAdKefAqt4bxdG9fnG6cRyRsmpZHxuFxw69msxUYJa7RBjlu55mxvVWzTbSQjhrtqwy0GWXhpB5pp/XWyEqzOySuBa/mCIllHdhoQV9lbHT6zP0X3Cc3CpEqq4RHc6FDU4lZUGKRtuXua1QTFffnEb3YI8HBCPuphYt6lfTVAUa4Wr5egGzVRtL47AqFx3RqcEn07Gwns3ZAsfVGzt75SgU8Pzq6CpLhN90FmXZEmtdlO5oUZPkAhX1QqUzdCaXn+JnLXR+7GFIm+5OJOALkqC9s8cP1DPqWwLdgpvzxxZfF1OF8459LxXOX5RX8Ayn5zw0dJUYN2Wr82ok3fdmXVlOK9NnJksNJTuSvRiKChW/hW+bNLz6aGijGViMyYHCeYj4ReY/myO9ACNYqcMRC+D4MzqQuA6GIYtjYIP0BGN498snh0bycoS6ZItRiE6fltvT1FCUr5IxZchPBLKbzwvgB8TE9/mvIJlU7yFD7gERJL0hBeatMxFIxhBDsKoebDTW/42wl+qMi3yLg2qvXhixo9SikvzFwrUYvC0+OT5FUIs8x9w+7WjvkbYUn0kdigyb8BQgZmRHaFbBcpfBD7L7N9KeQ//sBesdExuh0H2c40qsse2KGQugU/bd9IYGMFCuL1PaxJzdbhvVipksqBUmtnLKITnSAGwS+Mxz9qYUVx0odYVWHPl3o3kBQmoGsvNR2JPfVvYWcXHO2S5cOhilumWQMBAc3ImRpRlibqiqslyQpyplVL43Y5tPeImRtHI5qA6t/MarULxQ4vn46hqtfmo/1Dcvq10wzLkcCsX6wAovGxGRJRKgZbRQR7DKipgwsDBeA8vv4t0tQmXoojUT/TErJcl7bUB5DjF3JUHvv6KkZs3op8JbOjsGHlWmDzii/3gQPOaof9nKGaZqpy11P0Vf1bL+8CTPfvOY/ZDM7FaC2uyxfDC67HdrHoX620+N88leApzClEwp7hqXz83tsVfv8kD6GQaeYxeEp3aWbWXYus2nibj4WPQaJsTpDinTlgZcVALN/8Y/GpRnbrrLj9ALLkcBm/52W/qvtMWS0V06vCXVd0gHueGVTU7Ypsn31vRaWcOMjipuK7KodEy57ko1QCkM6fqINR59bhcDOJxQ4+hUtHkzfYnUcsS9jDE+XxoO1R7tRSi2RBRA5fdG3V3mUu571Z85UCWwP386MNYuxXr++QmePAz4Z5kaXpgF29yrzU7VJnShhggMxEDtEUqkvtGD6QexyzjUSv53DKon94jO4uKA==",
      configuration: config,
      externalViewControllerFactory: nil
    )
    
    // Set delegate
    videoEditorSDK?.delegate = self
    
    DispatchQueue.main.async {
      guard let presentedVC = RCTPresentedViewController() else {
        return
      }
      let config = VideoEditorLaunchConfig(
        entryPoint: .camera,
        hostController: presentedVC,
        animated: true
      )
      self.videoEditorSDK?.presentVideoEditor(
        withLaunchConfiguration: config,
        completion: nil
      )
    }
  }
  
  private func createVideoEditorConfiguration() -> VideoEditorConfig {
    let config = VideoEditorConfig()
    // Do customization here
    return config
  }
  
  // MARK: - RCTBridgeModule
  static func moduleName() -> String! {
    return "VideoEditorModule"
  }
}

// MARK: - Export flow
extension VideoEditorModule {
  func exportVideo() {
    let manager = FileManager.default
    // File name
    let firstFileURL = manager.temporaryDirectory.appendingPathComponent("tmp1.mov")
    if manager.fileExists(atPath: firstFileURL.path) {
      try? manager.removeItem(at: firstFileURL)
    }
    
    // Video configuration
    let exportVideoConfigurations: [ExportVideoConfiguration] = [
      ExportVideoConfiguration(
        fileURL: firstFileURL,
        quality: .auto,
        useHEVCCodecIfPossible: true,
        watermarkConfiguration: nil
      )
    ]
    
    // Export Configuration
    let exportConfiguration = ExportConfiguration(
      videoConfigurations: exportVideoConfigurations,
      isCoverEnabled: true,
      gifSettings: nil
    )
    
    // Export func
    videoEditorSDK?.export(
      using: exportConfiguration
    ) { [weak self] (success, error, coverImage) in
      // Export Callback
      DispatchQueue.main.async {
        if success {
          // Result urls. You could interact with your own implementation.
          self?.currentResolve!(["videoUri": firstFileURL.absoluteString])
          // remove strong reference to video editor sdk instance
          self?.videoEditorSDK = nil
        } else {
          self?.currentReject!("", error?.errorMessage, nil)
          // remove strong reference to video editor sdk instance
          self?.videoEditorSDK = nil
          print("Error: \(String(describing: error))")
        }
      }
    }
  }
}

// MARK: - BanubaVideoEditorSDKDelegate
extension VideoEditorModule: BanubaVideoEditorDelegate {
  func videoEditorDidCancel(_ videoEditor: BanubaVideoEditor) {
    videoEditor.dismissVideoEditor(animated: true) { [weak self] in
      // remove strong reference to video editor sdk instance
      self?.videoEditorSDK = nil
      self?.currentResolve!(NSNull())
    }
  }
  
  func videoEditorDone(_ videoEditor: BanubaVideoEditor) {
    videoEditor.dismissVideoEditor(animated: true) { [weak self] in
      self?.exportVideo()
    }
  }
}
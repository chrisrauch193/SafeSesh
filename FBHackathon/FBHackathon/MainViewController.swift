//
//  MainViewController.swift
//  FBHackathon
//
//  Created by Dawand Sulaiman on 11/03/2017.
//  Copyright © 2017 CarrotApps. All rights reserved.
//

import UIKit

class MainViewController: UIViewController {

    var amount:Int!
    
    @IBAction func exitTapped(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
    @IBOutlet var amountValue: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        amountValue.text = "£\(String(amount))"
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
}

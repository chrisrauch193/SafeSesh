//
//  ViewController.swift
//  FBHackathon
//
//  Created by Dawand Sulaiman on 11/03/2017.
//  Copyright © 2017 CarrotApps. All rights reserved.

import UIKit

class ViewController: UIViewController, UIViewControllerTransitioningDelegate {

    var value:Int!
    
    let transition = BubbleTransition()

    @IBOutlet var startButton: SpringButton!
    @IBOutlet var stepper: UIStepper!
    @IBOutlet var stepperLabel: SpringLabel!
    
    @IBAction func startSesh(_ sender: UIStepper) {
        let destinationVC:MainViewController = self.storyboard?.instantiateViewController(withIdentifier: "MainVC") as! MainViewController
        destinationVC.amount = value
        
        // do the transition
        destinationVC.transitioningDelegate = self
        destinationVC.modalPresentationStyle = .custom
        
        self.present(destinationVC, animated: true, completion: nil)
    }
    
    @IBAction func stepperValueChanged(_ sender: UIStepper) {
        
        if Int(sender.value) > value {
            stepperLabel.animation = "pop"
        } else {
            stepperLabel.animation = "squeeze"
        }
        
        stepperLabel.text = "£\(Int(sender.value).description)"
        value = Int(sender.value)
        
        stepperLabel.animate()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        value = Int(stepper.value)
        stepperLabel.text = "£\(String(value))"

        startButton.layer.cornerRadius = 5
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: UIViewControllerTransitioningDelegate
    
    public func animationController(forPresented presented: UIViewController, presenting: UIViewController, source: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        transition.transitionMode = .present
        transition.startingPoint = startButton.center
        transition.bubbleColor = startButton.backgroundColor!
        return transition
    }
    
    public func animationController(forDismissed dismissed: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        transition.transitionMode = .dismiss
        transition.startingPoint = startButton.center
        transition.bubbleColor = startButton.backgroundColor!
        return transition
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
}

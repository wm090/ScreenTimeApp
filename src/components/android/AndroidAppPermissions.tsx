import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";

interface AndroidAppPermissionsProps {
  onRequestPermission?: () => void;
  onSkip?: () => void;
  permissionsGranted?: boolean;
}

const AndroidAppPermissions = ({
  onRequestPermission = () => {},
  onSkip = () => {},
  permissionsGranted = false,
}: AndroidAppPermissionsProps) => {
  return (
    <Card className="w-full max-w-[500px] bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <CardTitle className="text-xl">App Permissions Required</CardTitle>
            <CardDescription>
              To monitor app usage and send notifications
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium flex items-center text-blue-800">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            Why we need these permissions
          </h3>
          <p className="mt-2 text-sm text-blue-700">
            This app needs access to usage statistics to monitor how long you
            spend in specific apps. We also need notification permission to
            alert you when you exceed your set time limits.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
            <div
              className={`mt-0.5 ${permissionsGranted ? "text-green-500" : "text-gray-400"}`}
            >
              {permissionsGranted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <div>
              <h4 className="font-medium">Usage Access Permission</h4>
              <p className="text-sm text-gray-600 mt-1">
                Allows the app to track how long you use other applications
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
            <div
              className={`mt-0.5 ${permissionsGranted ? "text-green-500" : "text-gray-400"}`}
            >
              {permissionsGranted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <div>
              <h4 className="font-medium">Notification Permission</h4>
              <p className="text-sm text-gray-600 mt-1">
                Allows the app to send alerts when you exceed your time limits
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
            <div
              className={`mt-0.5 ${permissionsGranted ? "text-green-500" : "text-gray-400"}`}
            >
              {permissionsGranted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <div>
              <h4 className="font-medium">Run in Background</h4>
              <p className="text-sm text-gray-600 mt-1">
                Allows the app to monitor usage even when not actively open
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        {permissionsGranted ? (
          <Button className="w-full sm:w-auto" onClick={onSkip}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            All Permissions Granted
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onSkip}
            >
              Skip for Now
            </Button>
            <Button className="w-full sm:w-auto" onClick={onRequestPermission}>
              Grant Permissions
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AndroidAppPermissions;

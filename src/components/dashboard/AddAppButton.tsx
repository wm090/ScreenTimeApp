import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface AddAppButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const AddAppButton = ({
  onClick = () => {},
  disabled = false,
}: AddAppButtonProps) => {
  return (
    <Card className="w-[330px] h-[180px] bg-white hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center justify-center border-dashed border-2 border-gray-300 hover:border-gray-400">
      <CardHeader className="pb-0">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <Plus className="w-8 h-8 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <h3 className="font-medium text-lg text-gray-700 mb-2">Add New App</h3>
        <p className="text-sm text-gray-500 mb-4">
          Monitor usage for another application
        </p>
        <Button
          onClick={onClick}
          disabled={disabled}
          variant="outline"
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add App
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddAppButton;

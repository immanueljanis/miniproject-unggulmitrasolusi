import { Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function Button({
    children,
    onPress,
    style,
    loading = false
}: {
    children: React.ReactNode;
    onPress: () => void;
    style?: any;
    loading?: boolean;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={[{
                backgroundColor: '#007AFF',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
            }, style]}
            disabled={loading}>
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                children
            )}
        </Pressable>
    );
}